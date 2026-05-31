# 灵山全景 — Vue 3 重构版

基于 **Vue 3 + Vite + Three.js** 的模块化重构，严格遵循生产级性能与内存安全规范。

---

## 快速开始

```bash
# 进入项目目录
cd vue-app

# 安装依赖（已包含 vue / vue-router / three）
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态服务器。

---

## 路由说明

| 路由 | 页面 | 说明 |
|------|------|------|
| `/#/` | **PanoramaView** | Three.js HDRI 全景查看器（主入口） |
| `/#/aerial` | **AerialView** | 航拍图片平移缩放查看器 |
| `/#/textbox` | **TextboxDemoView** | 青铜大佛风格文本框组件展示 |

---

## 目录结构

```
src/
├── main.js                    # 应用入口
├── App.vue                    # 根组件（仅挂载 router-view）
├── router/
│   └── index.js               # Hash 路由配置
├── data/
│   ├── panoramaScenes.js      # 全景场景数据
│   ├── aerialScenes.js        # 航拍场景数据
│   ├── introTexts.js          # 景点介绍文案
│   └── aerialMaps.js          # 航拍预览映射工具
├── components/
│   ├── LingshanTextbox.vue    # 青铜大佛风格文本框（可复用）
│   ├── ThumbnailStrip.vue     # 底部缩略图栏（全景/航拍共用）
│   ├── LoadingScreen.vue      # 加载动画（莲花 + 佛经轮播）
│   ├── FadeOverlay.vue        # 场景切换淡入淡出遮罩
│   ├── NavigationArrows.vue   # 返回箭头
│   ├── SwitchButton.vue       # 佛法台/普渡台切换
│   ├── AerialBadge.vue        # 航拍标签徽章
│   ├── AerialPreview.vue      # 航拍预览浮层
│   ├── LabelPanel.vue         # 标签场景选择面板
│   ├── IntroPanel.vue         # 景点介绍面板
│   └── CoordinateDisplay.vue  # 坐标显示（DOM 直连）
├── views/
│   ├── PanoramaView.vue       # 全景主视图
│   ├── AerialView.vue         # 航拍视图
│   └── TextboxDemoView.vue    # 文本框展示页
├── composables/
│   ├── useThreePanorama.js    # Three.js 核心逻辑（生产级）
│   └── useAerialViewer.js     # 图片查看器核心逻辑（生产级）
└── utils/
    ├── labelTextures.js       # Canvas 标签/箭头纹理生成
    └── shaders.js             # 过渡特效 Shader（预留）
```

---

## 优化点总结（对应 8 条强制规则）

### 1. 零响应式污染
- **scene / camera / renderer / controls / geometry / material / texture / sprite** 等全部使用普通 `let` 变量，绝对禁止 `ref / reactive` 包裹。
- `lon / lat / fov / scale / tx / ty` 等高频动画数据同样使用普通 `let`。
- Vue 仅暴露最小化的 UI 状态（`currentIndex / loading / switching`），避免每帧触发响应式追踪导致卡顿。

### 2. 唯一动画循环
- 使用单个 `requestAnimationFrame` 循环，ID 保存在普通变量 `animateId` 中。
- 组件卸载时第一优先级 `cancelAnimationFrame(animateId)`，确保页面永远只有一个 RAF，杜绝动画叠加。
- 惯性滚动也使用同一机制，先 `cancelAnimationFrame` 再启动新的。

### 3. 完整内存销毁链
`onUnmounted` 执行严格顺序：
1. `cancelAnimationFrame` 停止所有动画
2. `window.removeEventListener('resize', ...)` 移除窗口监听
3. `controls.dispose()` 销毁 OrbitControls（内部解绑 pointer / wheel）
4. `clearLabels()` 遍历销毁所有 Sprite + Material + Texture
5. `disposeMaterial()` 销毁球体材质与贴图
6. `sphere.geometry.dispose()` 释放几何体
7. `renderer.domElement` 从 DOM 移除
8. `renderer.dispose()` 释放 WebGL 资源
9. `renderer.forceContextLoss()` 强制释放上下文
10. 所有引用置 `null`，确保 GC 回收

**结果：反复切换 `/` ↔ `/aerial` 路由，内存曲线平稳，无泄漏、无报错。**

### 4. DOM 挂载规范
- 仅使用 `const viewerRef = ref(null)` 绑定容器，`init()` 统一放在 `onMounted` 中执行。
- 彻底禁止 `document.getElementById`，所有 DOM 操作通过 Vue ref 或组件实例完成。

### 5. 窗口自适应
- `resize` 事件实时更新：
  - `camera.aspect` + `updateProjectionMatrix()`
  - `renderer.setSize()` + `setPixelRatio()`
- 页面卸载时 `removeEventListener` 移除监听，无残留事件。

### 6. 轨道控制器优化
- 引入 `OrbitControls`，采用 **dummyCamera 方案**：
  - dummyCamera 位于单位球面，OrbitControls 控制其绕原点旋转
  - 真实相机固定于球心 `(0,0,0)`，每帧 `lookAt(dummyCamera.position)`
- 配置：
  - `enableDamping: true` + `dampingFactor: 0.05` — 平滑惯性旋转
  - `enablePan: false` — 禁用平移（全景不需要）
  - `enableZoom: false` — 禁用默认缩放（独立 FOV 控制）
  - `minPolarAngle: 5°` / `maxPolarAngle: 175°` — 防止相机穿模到球体接缝
  - `rotateSpeed: -0.3` — 拖拽方向符合直觉

### 7. 渲染性能优化
- **抗锯齿开启**：`antialias: true`
- **DPR 限制**：`Math.min(window.devicePixelRatio, 2)`，防止 4K 屏过度渲染
- **透明背景关闭**：`alpha: false`，减少合成层开销
- **超大纹理自动降采样**：
  - 单张纹理上限 8192px（`招运铃` 场景限制 2048px）
  - 超出时自动绘制到 Canvas 再生成 `CanvasTexture`，防止移动端显存爆炸
- **临时对象池**：`_tempDir / _tempSpherical / _tempLookAt` 每帧复用，零 `new Vector3()` 开销
- **坐标显示直连 DOM**：通过 `onFrame` 回调直接写 `textContent`，不走 Vue 响应式，彻底消除 RAF 与 Vue 调度冲突

### 8. 容错处理
- WebGL 初始化失败：捕获异常，渲染友好错误提示页（非控制台爆红）
- WebGL 上下文丢失：监听 `webglcontextlost`，显示 GPU 显存耗尽提示
- 纹理加载失败：`textureLoader.load` 增加 `onError` 回调，状态回退，不阻断流程
- DOM 未就绪：`init()` 入口处判断 `containerRef.value` 为空则直接返回并打印日志
- 组件已卸载保护：所有异步回调（`textureLoader.load / setTimeout / requestAnimationFrame`）内部先检查 `isDisposed` 标志

---

## 使用说明

### 开发
```bash
npm run dev
# 访问 http://localhost:5173/
```

### 构建
```bash
npm run build
# 产物位于 dist/ 目录
```

### 静态资源
- 全景原图与缩略图通过符号链接挂载到 `public/web` 和 `public/thumbs`
- 构建时会自动复制到 `dist/` 根目录
- 代码中统一使用绝对路径 `/web/...` 和 `/thumbs/...`

### 路由模式
- 使用 **Hash 模式** (`createWebHashHistory`)，兼容静态文件服务器（GitHub Pages / Nginx / Apache 等），无需后端配置 rewrite。

---

## 注意事项

1. **Three.js Chunk 体积**：Three.js 核心约 650KB（gzip ~180KB），属于正常范围。如需进一步拆包，可将 Three.js 改为 CDN 外链 + `build.rollupOptions.external`。
2. **符号链接**：`public/web` 和 `public/thumbs` 分别链接到项目根目录的 `web/` 和 `thumbs/`。若迁移项目，请确保符号链接或重新配置 `vite.config.js` 的 `publicDir`。
3. **浏览器兼容**：需要支持 WebGL 2.0 的现代浏览器（Chrome 90+ / Edge 90+ / Safari 15+）。
