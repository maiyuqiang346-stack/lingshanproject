import { ref, onUnmounted } from 'vue'

/**
 * 生产级航拍图片查看器 Composable
 *
 * 优化要点：
 * 1. 所有运行时状态（scale/tx/ty/拖拽/惯性）全部使用普通 let，禁止 ref 包裹高频数据。
 * 2. 单一 RAF 惯性循环，组件卸载时强制 cancelAnimationFrame。
 * 3. 完整事件解绑 + DOM 清理 + 图片引用释放，杜绝内存泄漏。
 * 4. resize/pointer/wheel/touch/keyboard 事件统一注册、统一移除。
 * 5. 容错：viewerRef 未挂载、图片加载失败均不爆红。
 */
export function useAerialViewer(viewerRef, images) {
  // ===== 仅暴露给 UI 的最小响应式状态 =====
  const currentIndex = ref(-1)
  const switching = ref(false)
  const loading = ref(false)

  // ===== 运行时状态 —— 普通 let，高频读写 =====
  let currentImg = null
  let scale = 1
  let tx = 0
  let ty = 0
  let minScale = 0.1
  const MAX_SCALE = 5

  let dragging = false
  let dragStartX = 0
  let dragStartY = 0
  let dragStartTx = 0
  let dragStartTy = 0

  let velocityX = 0
  let velocityY = 0
  let lastMoveX = 0
  let lastMoveY = 0
  let lastMoveTime = 0
  let inertiaRaf = null

  let isDisposed = false

  // ===== 缩放提示直接写 DOM，避免响应式 =====
  let zoomHintEl = null

  function setZoomHint(text) {
    if (!zoomHintEl) {
      const el = document.querySelector('.aerial-view .zoom-hint')
      if (el) zoomHintEl = el
    }
    if (zoomHintEl) zoomHintEl.textContent = text
  }

  // ===== 图片变换核心 =====
  function fitImage(natW, natH) {
    const el = viewerRef.value
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const fitScale = Math.min(vw / natW, vh / natH)
    const s = fitScale * 0.92
    tx = (vw - natW * s) / 2
    ty = (vh - natH * s) / 2
    scale = s
    minScale = s * 0.8
    applyTransform()
  }

  function applyTransform() {
    if (!currentImg) return
    currentImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
    const pct = Math.round((scale / minScale) * 100)
    setZoomHint(pct > 100 ? `${pct}%` : '')
  }

  function clampPan() {
    if (!currentImg || !currentImg.naturalWidth) return
    const el = viewerRef.value
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const iw = currentImg.naturalWidth * scale
    const ih = currentImg.naturalHeight * scale

    if (iw <= vw) tx = (vw - iw) / 2
    else tx = Math.min(0, Math.max(vw - iw, tx))

    if (ih <= vh) ty = (vh - ih) / 2
    else ty = Math.min(0, Math.max(vh - ih, ty))
  }

  function zoomAt(cx, cy, newScale) {
    newScale = Math.max(minScale, Math.min(MAX_SCALE, newScale))
    const ratio = newScale / scale
    tx = cx - (cx - tx) * ratio
    ty = cy - (cy - ty) * ratio
    scale = newScale
    clampPan()
    applyTransform()
  }

  // ===== 场景切换 =====
  function switchScene(index) {
    if (index === currentIndex.value || switching.value) return
    switching.value = true
    currentIndex.value = index
    loading.value = true

    const img = new Image()
    img.onload = () => {
      if (isDisposed) return
      removeCurrentImg()
      currentImg = img
      img.style.width = img.naturalWidth + 'px'
      img.style.height = img.naturalHeight + 'px'
      img.style.opacity = '0'
      img.style.position = 'absolute'
      img.style.transformOrigin = '0 0'
      img.style.willChange = 'transform'
      img.style.userSelect = 'none'
      img.style.webkitUserDrag = 'none'

      const el = viewerRef.value
      if (el) el.appendChild(img)

      fitImage(img.naturalWidth, img.naturalHeight)

      requestAnimationFrame(() => {
        img.style.transition = 'opacity 0.3s'
        img.style.opacity = '1'
        loading.value = false
        switching.value = false
        setTimeout(() => {
          img.style.transition = ''
        }, 300)
      })
    }
    img.onerror = () => {
      if (isDisposed) return
      loading.value = false
      switching.value = false
    }
    img.src = images[index].s
  }

  function removeCurrentImg() {
    if (currentImg) {
      if (currentImg.parentNode) currentImg.parentNode.removeChild(currentImg)
      currentImg.onload = null
      currentImg.onerror = null
      currentImg = null
    }
  }

  // ===== 指针事件 =====
  function onPointerDown(e) {
    if (e.button !== 0 || !viewerRef.value) return
    stopInertia()
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragStartTx = tx
    dragStartTy = ty
    lastMoveX = e.clientX
    lastMoveY = e.clientY
    lastMoveTime = performance.now()
    velocityX = 0
    velocityY = 0
    viewerRef.value.classList.add('dragging')
    viewerRef.value.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging || !viewerRef.value) return
    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY

    const now = performance.now()
    const dt = now - lastMoveTime
    if (dt > 0) {
      velocityX = (e.clientX - lastMoveX) / dt
      velocityY = (e.clientY - lastMoveY) / dt
    }
    lastMoveX = e.clientX
    lastMoveY = e.clientY
    lastMoveTime = now

    tx = dragStartTx + dx
    ty = dragStartTy + dy
    clampPan()
    applyTransform()
  }

  function onPointerUp() {
    if (!dragging || !viewerRef.value) return
    dragging = false
    viewerRef.value.classList.remove('dragging')
    startInertia()
  }

  function stopInertia() {
    if (inertiaRaf) {
      cancelAnimationFrame(inertiaRaf)
      inertiaRaf = null
    }
  }

  function startInertia() {
    const threshold = 0.02
    const step = () => {
      if (
        Math.abs(velocityX) < threshold &&
        Math.abs(velocityY) < threshold
      ) {
        inertiaRaf = null
        return
      }
      tx += velocityX * 16
      ty += velocityY * 16
      velocityX *= 0.92
      velocityY *= 0.92
      clampPan()
      applyTransform()
      inertiaRaf = requestAnimationFrame(step)
    }
    inertiaRaf = requestAnimationFrame(step)
  }

  // ===== 滚轮缩放 =====
  function onWheel(e) {
    e.preventDefault()
    const el = viewerRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const delta = -e.deltaY * 0.001
    zoomAt(cx, cy, scale * (1 + delta))
  }

  // ===== 双指缩放 =====
  let lastTouchDist = 0
  let touchScaleStart = 1

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      stopInertia()
      dragging = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist = Math.sqrt(dx * dx + dy * dy)
      touchScaleStart = scale
    }
  }

  function onTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const newScale = touchScaleStart * (dist / lastTouchDist)
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const el = viewerRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      zoomAt(midX - rect.left, midY - rect.top, newScale)
      touchScaleStart = scale
      lastTouchDist = dist
    }
  }

  // ===== 窗口自适应 =====
  function onResize() {
    if (!currentImg || !currentImg.naturalWidth) return
    fitImage(currentImg.naturalWidth, currentImg.naturalHeight)
  }

  // ===== 键盘快捷键 =====
  function onKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const next = (currentIndex.value + 1) % images.length
      switchScene(next)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const prev =
        (currentIndex.value - 1 + images.length) % images.length
      switchScene(prev)
    } else if (e.key === '0') {
      if (currentImg && currentImg.naturalWidth) {
        fitImage(currentImg.naturalWidth, currentImg.naturalHeight)
      }
    }
  }

  // ===== 事件注册 =====
  function setupEvents() {
    const el = viewerRef.value
    if (!el) return
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKeyDown)
  }

  // ===== 完整销毁链 =====
  function dispose() {
    if (isDisposed) return
    isDisposed = true

    stopInertia()

    const el = viewerRef.value
    if (el) {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onKeyDown)

    removeCurrentImg()
    zoomHintEl = null
  }

  onUnmounted(dispose)

  return {
    currentIndex,
    switching,
    loading,
    switchScene,
    setupEvents,
    dispose,
  }
}
