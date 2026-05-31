import { ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createLabelTexture, createArrowTexture } from '../utils/labelTextures.js'

/**
 * 生产级 Three.js 全景查看器 Composable
 *
 * 架构原则：
 * 1. Three.js 核心对象（scene/camera/renderer/controls/几何体/材质/贴图）
 *    全部使用普通 let 变量，禁止 ref/reactive 包裹，避免 Vue 响应式系统污染与性能损耗。
 * 2. 仅暴露最小化的 UI 状态（currentIndex/loading/switching）给 Vue 模板，
 *    高频数据（lon/lat/fov）通过 onFrame 回调直接写 DOM，不走响应式。
 * 3. 单一 RAF 循环，组件卸载时强制 cancelAnimationFrame，杜绝动画叠加。
 * 4. onUnmounted 完整销毁链：renderer.dispose() → geometry/material/texture.dispose()
 *    → controls.dispose() → 事件解绑 → DOM 移除 → forceContextLoss()。
 *    反复进入/退出路由零内存泄漏、零报错。
 * 5. 使用 OrbitControls + dummyCamera 方案实现阻尼、平滑旋转、限制缩放、防止穿模。
 */
export function useThreePanorama(containerRef, scenes, options = {}) {
  // ===== 仅暴露给 UI 的最小响应式状态 =====
  const currentIndex = ref(-1)
  const switching = ref(false)
  const loading = ref(false)

  // ===== Three.js 核心对象 —— 全部普通 let，禁止 ref =====
  let scene = null
  let camera = null
  let renderer = null
  let sphere = null
  let currentTexture = null
  let textureLoader = null
  let dummyCamera = null
  let controls = null
  let currentLabels = []
  let animateId = null
  let isDisposed = false

  // ===== 运行时状态 —— 普通 let，动画循环高频读写 =====
  let lon = 0
  let lat = 0
  let fov = 100

  // ===== 临时对象池 —— 避免每帧 new 对象导致 GC 卡顿 =====
  const _tempDir = new THREE.Vector3()
  const _tempSpherical = new THREE.Spherical()
  const _tempLookAt = new THREE.Vector3()

  const { onFrame } = options

  // ===== 初始化 =====
  function init() {
    if (isDisposed) return
    const container = containerRef.value
    if (!container) {
      console.error('[useThreePanorama] containerRef is null')
      return
    }

    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || (window.innerHeight - 110)

    // Scene
    scene = new THREE.Scene()

    // Camera（真实相机固定在球心）
    camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 1100)
    camera.position.set(0, 0, 0)

    // Renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      })
    } catch (e) {
      showWebGLError(container)
      throw e
    }

    // 设备像素比限制为 2，防止高分屏渲染开销过大
    const dpr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const cvs = renderer.domElement
    cvs.style.position = 'absolute'
    cvs.style.top = '0'
    cvs.style.left = '0'
    cvs.style.zIndex = '1'
    cvs.style.display = 'block'
    cvs.style.outline = 'none'
    cvs.style.touchAction = 'none'

    // WebGL 上下文丢失/恢复
    cvs.addEventListener('webglcontextlost', onContextLost, false)
    cvs.addEventListener('webglcontextrestored', onContextRestored, false)

    container.appendChild(cvs)

    // ===== OrbitControls + dummyCamera 方案 =====
    // dummyCamera 放在单位球面上，OrbitControls 让其绕原点旋转
    // 真实相机 copy 其方向，实现全景阻尼旋转
    dummyCamera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 1100)
    dummyCamera.position.set(0, 0, 1)

    controls = new OrbitControls(dummyCamera, cvs)
    controls.enablePan = false          // 禁用平移（全景不需要）
    controls.enableZoom = false         // 禁用默认缩放（我们用 FOV 控制）
    controls.enableDamping = true       // 开启阻尼惯性
    controls.dampingFactor = 0.05       // 阻尼系数
    controls.rotateSpeed = -0.3         // 反转旋转方向，使拖拽更自然
    controls.minDistance = 1            // 锁定距离为 1
    controls.maxDistance = 1
    controls.minPolarAngle = THREE.MathUtils.degToRad(5)   // 防止看到球顶接缝
    controls.maxPolarAngle = THREE.MathUtils.degToRad(175) // 防止看到球底接缝
    controls.target.set(0, 0, 0)

    textureLoader = new THREE.TextureLoader()

    // 反向球体：相机在球心，看向内部
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // 窗口自适应
    window.addEventListener('resize', onResize)

    // 滚轮缩放（FOV）
    cvs.addEventListener('wheel', onWheel, { passive: false })

    // 启动唯一动画循环
    animate()
  }

  // ===== 唯一动画循环 =====
  function animate() {
    if (isDisposed) return
    animateId = requestAnimationFrame(animate)

    controls.update()

    // 从 dummyCamera 位置提取方向并同步真实相机
    _tempDir.copy(dummyCamera.position).normalize()
    camera.position.set(0, 0, 0)
    _tempLookAt.copy(_tempDir).multiplyScalar(500)
    camera.lookAt(_tempLookAt)

    // 同步 lon/lat 用于坐标显示与场景切换恢复
    _tempSpherical.setFromVector3(_tempDir)
    lon = THREE.MathUtils.radToDeg(_tempSpherical.theta)
    lat = 90 - THREE.MathUtils.radToDeg(_tempSpherical.phi)

    // 标签呼吸浮动动画
    const time = performance.now() * 0.001
    for (let i = 0; i < currentLabels.length; i++) {
      const sprite = currentLabels[i]
      if (sprite.userData.baseY !== undefined) {
        sprite.position.y = sprite.userData.baseY + Math.sin(time + sprite.userData.floatOffset) * 4
      }
    }

    renderer.render(scene, camera)

    // 每帧回调，直接写 DOM，不走 Vue 响应式
    if (onFrame) {
      onFrame({ lon, lat, fov })
    }
  }

  // ===== 场景加载 =====
  function loadPanorama(index, fade = true) {
    if (isDisposed) return
    if (
      typeof index !== 'number' ||
      index < 0 ||
      index >= scenes.length ||
      index === currentIndex.value
    )
      return

    // 先清理旧标签，避免显存堆积
    clearLabels()
    currentIndex.value = index

    if (!fade) {
      doLoad(index)
      return
    }
    switching.value = true
    setTimeout(() => doLoad(index), 400)
  }

  function doLoad(index) {
    if (isDisposed) return
    loading.value = true

    const sceneData = scenes[index]
    lon = sceneData.lon || 0
    lat = sceneData.lat || 0
    fov = sceneData.fov || 100

    camera.fov = fov
    camera.updateProjectionMatrix()
    if (dummyCamera) {
      dummyCamera.fov = fov
      dummyCamera.updateProjectionMatrix()
    }

    // 同步 OrbitControls 朝向到新的 lon/lat
    setDirectionFromLonLat(lon, lat)

    textureLoader.load(
      sceneData.w,
      (texture) => {
        if (isDisposed) {
          texture.dispose()
          return
        }

        texture.colorSpace = THREE.SRGBColorSpace
        const img = texture.image

        // 超大纹理降采样，防止移动端显存爆炸
        const MAX_TEX = sceneData.n === '招运铃' ? 2048 : 8192
        let finalTexture = texture
        if (img && (img.width > MAX_TEX || img.height > MAX_TEX)) {
          const s = Math.min(MAX_TEX / img.width, MAX_TEX / img.height)
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(img.width * s)
          canvas.height = Math.floor(img.height * s)
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
          texture.dispose()
          finalTexture = new THREE.CanvasTexture(canvas)
          finalTexture.colorSpace = THREE.SRGBColorSpace
        }

        // 安全替换材质
        disposeMaterial()
        if (currentTexture) {
          currentTexture.dispose()
          currentTexture = null
        }
        currentTexture = finalTexture
        sphere.material = new THREE.MeshBasicMaterial({ map: finalTexture })

        loading.value = false
        renderLabels(index)
        switching.value = false
      },
      undefined,
      (err) => {
        console.error('[useThreePanorama] 纹理加载失败:', sceneData.w, err)
        if (isDisposed) return
        loading.value = false
        switching.value = false
      }
    )
  }

  // ===== 从 lon/lat 设置 dummyCamera 方向 =====
  function setDirectionFromLonLat(lonVal, latVal) {
    if (!dummyCamera) return
    const phi = THREE.MathUtils.degToRad(90 - latVal)
    const theta = THREE.MathUtils.degToRad(lonVal)
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi) * Math.sin(theta)
    dummyCamera.position.set(x, y, z)
    dummyCamera.lookAt(0, 0, 0)
    if (controls) controls.update()
  }

  // ===== 3D 标签渲染 =====
  function renderLabels(index) {
    if (!scene) return
    const img = scenes[index]
    if (!img || !img.labels) return
    clearLabels()

    for (let i = 0; i < img.labels.length; i++) {
      const lbl = img.labels[i]
      const phi = THREE.MathUtils.degToRad(90 - lbl.lat)
      const theta = THREE.MathUtils.degToRad(lbl.lon)
      const r = 499
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      let tex, scaleX, scaleY
      if (lbl.type === 'arrow') {
        tex = createArrowTexture(lbl.name)
        const s = lbl.scale || 1
        scaleX = 65 * s
        scaleY = 110 * s
      } else {
        tex = createLabelTexture(lbl.name)
        scaleX = 28 * (tex.image.width / tex.image.height)
        scaleY = 28
      }

      const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false })
      mat.rotation = lbl.rotation || 0
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(x, y, z)
      sprite.scale.set(scaleX, scaleY, 1)
      sprite.userData = {
        labelData: lbl,
        baseY: y,
        floatOffset: Math.random() * Math.PI * 2,
      }
      scene.add(sprite)
      currentLabels.push(sprite)
    }
  }

  // ===== Raycaster 标签点击检测 =====
  function checkLabelClick(clientX, clientY) {
    const container = containerRef.value
    if (!container || !camera) return null
    const rect = container.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(currentLabels)
    return intersects.length ? intersects[0].object.userData.labelData : null
  }

  // ===== 滚轮缩放：修改 FOV =====
  function onWheel(e) {
    e.preventDefault()
    if (!camera || !dummyCamera) return
    fov += e.deltaY * 0.05
    fov = THREE.MathUtils.clamp(fov, 20, 100)
    camera.fov = fov
    camera.updateProjectionMatrix()
    dummyCamera.fov = fov
    dummyCamera.updateProjectionMatrix()
  }

  // ===== 窗口自适应 =====
  function onResize() {
    if (!containerRef.value || !camera || !renderer || !dummyCamera) return
    const c = containerRef.value
    const w = c.clientWidth || window.innerWidth
    const h = c.clientHeight || (window.innerHeight - 110)

    camera.aspect = w / h
    camera.updateProjectionMatrix()
    dummyCamera.aspect = w / h
    dummyCamera.updateProjectionMatrix()
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  // ===== 显存/内存安全清理 =====
  function disposeMaterial() {
    if (sphere && sphere.material) {
      if (sphere.material.map) {
        sphere.material.map.dispose()
      }
      sphere.material.dispose()
      sphere.material = null
    }
  }

  function clearLabels() {
    if (!scene) return
    for (let i = 0; i < currentLabels.length; i++) {
      const l = currentLabels[i]
      scene.remove(l)
      if (l.material) {
        if (l.material.map) l.material.map.dispose()
        l.material.dispose()
      }
    }
    currentLabels = []
  }

  // ===== WebGL 错误提示 =====
  function showWebGLError(container) {
    container.innerHTML = `
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:#000;z-index:10;padding:20px;text-align:center;">
        <div style="font-size:18px;color:#d4a017;margin-bottom:12px;">⚠️ 无法启动 3D 渲染</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.7);max-width:400px;line-height:1.6;">
          当前浏览器禁用了 WebGL/GPU 加速，无法显示全景图。<br><br>
          请尝试以下方法：<br>
          1. <b>彻底关闭所有浏览器窗口</b>，重新打开（不要只刷新）<br>
          2. 用 Chrome / Edge 直接打开本页面<br>
          3. 检查 Edge 设置 → 系统 → 开启"使用硬件加速"<br>
          4. 更新显卡驱动后重启电脑
        </div>
      </div>`
  }

  function onContextLost(e) {
    e.preventDefault()
    const container = containerRef.value
    if (container) {
      container.innerHTML = `
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:#000;z-index:10;padding:20px;text-align:center;">
          <div style="font-size:18px;color:#d4a017;margin-bottom:12px;">⚠️ GPU 显存耗尽</div>
          <div style="font-size:14px;color:rgba(255,255,255,0.7);max-width:400px;line-height:1.6;">
            连续加载过多高清全景图，GPU 显存被占满。<br><br>
            <b>请彻底关闭所有浏览器窗口，重新打开本页面。</b><br>
            （按 F5 刷新无效）
          </div>
        </div>`
    }
  }

  function onContextRestored() {
    // 上下文恢复后建议用户刷新，自动重建过于复杂且不稳定
  }

  // ===== 完整销毁链 —— 路由切换/组件卸载时调用 =====
  function dispose() {
    if (isDisposed) return
    isDisposed = true

    // 1. 取消动画帧，必须先做，防止渲染中销毁资源
    if (animateId) {
      cancelAnimationFrame(animateId)
      animateId = null
    }

    // 2. 移除窗口事件
    window.removeEventListener('resize', onResize)

    // 3. 销毁 OrbitControls（内部会解绑 pointer/wheel 事件）
    if (controls) {
      controls.dispose()
      controls = null
    }

    // 4. 清理标签（dispose texture + material）
    clearLabels()

    // 5. 清理球体材质与贴图
    disposeMaterial()
    if (currentTexture) {
      currentTexture.dispose()
      currentTexture = null
    }

    // 6. 清理球体几何体
    if (sphere) {
      if (sphere.geometry) sphere.geometry.dispose()
      sphere = null
    }

    // 7. 销毁 renderer：dispose → forceContextLoss → 从 DOM 移除
    if (renderer) {
      const cvs = renderer.domElement
      cvs.removeEventListener('webglcontextlost', onContextLost)
      cvs.removeEventListener('webglcontextrestored', onContextRestored)
      cvs.removeEventListener('wheel', onWheel)
      cvs.parentNode?.removeChild(cvs)

      renderer.dispose()
      renderer.forceContextLoss()
      renderer = null
    }

    // 8. 释放其他引用
    scene = null
    camera = null
    dummyCamera = null
    textureLoader = null
  }

  return {
    currentIndex,
    switching,
    loading,
    init,
    loadPanorama,
    dispose,
    checkLabelClick,
  }
}
