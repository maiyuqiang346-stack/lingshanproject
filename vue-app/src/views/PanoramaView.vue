<template>
  <div class="panorama-view">
    <div ref="viewerRef" class="viewer">
      <FadeOverlay :active="switching" />

      <div class="toolbar">
        <router-link to="/aerial" class="toolbar-btn" @pointerdown.stop>
          航拍全景
        </router-link>
      </div>

      <CoordinateDisplay ref="coordRef" />

      <NavigationArrows :show="navStack.length > 0" @back="goBack" />

      <SwitchButton
        :show="showSwitch"
        :label="switchLabel"
        :icon="switchIcon"
        @click="onSwitchClick"
      />

      <LoadingScreen :show="loading" />

      <AerialBadge
        :show="showAerialBadge"
        :label="aerialBadgeLabel"
        @click="backToAerial"
      />

      <AerialPreview
        :show="aerialPreviewShow"
        :img-src="aerialPreviewImg"
        :show-hint="aerialPreviewShowHint"
        @click="onAerialPreviewClick"
      />

      <IntroPanel
        :show="introShow"
        :title="introTitle"
        :content="introContent"
      />

      <LabelPanel
        :show="labelPanelShow"
        :title="labelPanelTitle"
        :scenes="labelPanelScenes"
        @jump="jumpToScene"
        @close="hideLabelPanel"
      />
    </div>

    <ThumbnailStrip
      :items="stripItems"
      :active-index="currentIndex"
      :history-items="historyItems"
      @select="onStripSelect"
      @select-history="onHistorySelect"
    />
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { panoramaScenes } from '../data/panoramaScenes.js'
import { introTexts } from '../data/introTexts.js'
import { aerialPreviewMap, buildSceneToLabel } from '../data/aerialMaps.js'
import { useThreePanorama } from '../composables/useThreePanorama.js'
import FadeOverlay from '../components/FadeOverlay.vue'
import ThumbnailStrip from '../components/ThumbnailStrip.vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import NavigationArrows from '../components/NavigationArrows.vue'
import SwitchButton from '../components/SwitchButton.vue'
import AerialBadge from '../components/AerialBadge.vue'
import AerialPreview from '../components/AerialPreview.vue'
import IntroPanel from '../components/IntroPanel.vue'
import LabelPanel from '../components/LabelPanel.vue'
import CoordinateDisplay from '../components/CoordinateDisplay.vue'

const router = useRouter()
const viewerRef = ref(null)
const coordRef = ref(null)

// 导航堆栈与过滤状态
const navStack = ref([])
const currentStripFilter = ref(null)

// 预计算场景 → 航拍标签映射
const sceneToLabel = buildSceneToLabel(panoramaScenes)

// ===== 景点介绍面板 =====
const introShow = ref(false)
const introTitle = ref('')
const introContent = ref('')

// ===== 标签面板 =====
const labelPanelShow = ref(false)
const labelPanelTitle = ref('')
const labelPanelScenes = ref([])

// ===== 航拍预览 =====
const aerialPreviewShow = ref(false)
const aerialPreviewImg = ref('')
const aerialPreviewShowHint = ref(true)
let aerialPreviewTargetIdx = -1
let aerialPreviewFilterScenes = null

// ===== 点击拖拽防误触 =====
let clickStartX = 0
let clickStartY = 0

// ===== 初始化 Three.js 全景 Composable =====
// onFrame 直接写 DOM，lon/lat/fov 不走 Vue 响应式，杜绝帧率损耗
const {
  currentIndex,
  switching,
  loading,
  init,
  loadPanorama,
  dispose: disposePanorama,
  checkLabelClick,
} = useThreePanorama(viewerRef, panoramaScenes, {
  onFrame: ({ lon, lat }) => {
    const el = coordRef.value?.el
    if (el) {
      el.textContent = `lon: ${lon.toFixed(1)} | lat: ${lat.toFixed(1)}`
    }
  },
})

// ===== 计算属性 =====
const showSwitch = computed(() => {
  const name = panoramaScenes[currentIndex.value]?.n
  return name === '佛法台' || name === '普渡台'
})

const switchLabel = computed(() => {
  const name = panoramaScenes[currentIndex.value]?.n
  return name === '佛法台' ? '普渡台' : '佛法台'
})

const switchIcon = computed(() => {
  const name = panoramaScenes[currentIndex.value]?.n
  return name === '佛法台' ? 'moon' : 'sun'
})

const showAerialBadge = computed(() => {
  const name = panoramaScenes[currentIndex.value]?.n
  return !!sceneToLabel[name]
})

const aerialBadgeLabel = computed(() => {
  const name = panoramaScenes[currentIndex.value]?.n
  const li = sceneToLabel[name]
  return li ? `航拍${li.num} ${li.name}` : ''
})

const historyItems = computed(() =>
  navStack.value.map((idx) => panoramaScenes[idx]).filter(Boolean)
)

const stripItems = computed(() => {
  const items = []
  const currentScene = panoramaScenes[currentIndex.value]
  if (currentScene && Array.isArray(currentScene.labels)) {
    currentScene.labels.forEach((label) => {
      if (!label.scenes || label.scenes.length === 0) return
      const targetName = label.scenes[0]
      const targetIdx = panoramaScenes.findIndex((img) => img.n === targetName)
      if (targetIdx === -1) return
      if (navStack.value.includes(targetIdx)) return
      if (targetIdx === currentIndex.value) return
      items.push({
        ...panoramaScenes[targetIdx],
        index: targetIdx,
        name: label.name,
      })
    })
  }
  return items
})

// ===== 景点介绍面板更新 =====
function updateIntroPanel() {
  const sceneName = panoramaScenes[currentIndex.value]?.n
  const sceneToIntro = { 三圣殿6: '观音殿', 三圣殿9: '地藏殿' }
  const introKey = sceneToIntro[sceneName] || sceneName
  const text = introTexts[introKey]
  if (text) {
    introTitle.value = introKey
    introContent.value = text
      .split(/(?<=。)/)
      .filter((s) => s.trim())
      .map((s) => `<p>${s.trim()}</p>`)
      .join('')
    introShow.value = true
  } else {
    introShow.value = false
  }
}

// ===== 缩略图栏交互 =====
function onStripSelect(index) {
  jumpToScene(index)
}

function onHistorySelect(stackIndex) {
  const targetIdx = navStack.value[stackIndex]
  while (navStack.value.length > stackIndex) navStack.value.pop()
  if (typeof targetIdx === 'number') loadPanorama(targetIdx, true)
}

// ===== 场景跳转核心逻辑 =====
function jumpToScene(index, filterScenes = null) {
  hideLabelPanel()
  if (index === currentIndex.value) return
  if (switching.value) return

  const sceneName = panoramaScenes[index]?.n
  const aerialData = aerialPreviewMap[sceneName]

  // 若目标场景有航拍预览映射，先展示预览图
  if (aerialData) {
    const imgPath =
      typeof aerialData === 'string' ? aerialData : aerialData.img
    const targetName =
      typeof aerialData === 'string' ? null : aerialData.target
    const noTarget =
      typeof aerialData === 'object' && aerialData.noTarget
    const finalIdx = targetName
      ? panoramaScenes.findIndex((img) => img.n === targetName)
      : noTarget
        ? -1
        : index
    showAerialPreview(imgPath, finalIdx, filterScenes)
    return
  }

  // 常规跳转：当前入栈，加载目标
  if (currentIndex.value !== -1) navStack.value.push(currentIndex.value)
  currentStripFilter.value =
    filterScenes && filterScenes.length ? filterScenes : null
  loadPanorama(index, true)
}

function showAerialPreview(imgPath, targetIdx, filterScenes) {
  if (currentIndex.value !== -1) navStack.value.push(currentIndex.value)
  aerialPreviewImg.value = imgPath
  aerialPreviewShowHint.value = targetIdx !== -1
  aerialPreviewShow.value = true
  aerialPreviewTargetIdx = targetIdx
  aerialPreviewFilterScenes = filterScenes
}

function onAerialPreviewClick() {
  aerialPreviewShow.value = false
  aerialPreviewImg.value = ''
  if (aerialPreviewTargetIdx === -1) return
  currentStripFilter.value =
    aerialPreviewFilterScenes && aerialPreviewFilterScenes.length
      ? aerialPreviewFilterScenes
      : null
  loadPanorama(aerialPreviewTargetIdx, true)
}

// ===== 返回与航拍徽章 =====
function goBack() {
  if (aerialPreviewShow.value) {
    aerialPreviewShow.value = false
    aerialPreviewImg.value = ''
    if (navStack.value.length > 0) navStack.value.pop()
    return
  }
  if (navStack.value.length === 0) return
  const idx = navStack.value.pop()
  if (typeof idx === 'number' && idx >= 0 && idx < panoramaScenes.length) {
    loadPanorama(idx, true)
  }
}

function backToAerial() {
  const idx = panoramaScenes.findIndex((img) => img.n === '航拍0563')
  if (idx === -1) return
  const li = sceneToLabel[panoramaScenes[currentIndex.value]?.n]
  if (li) {
    panoramaScenes[idx].lon = li.lon
    panoramaScenes[idx].lat = li.lat
  }
  hideLabelPanel()
  if (switching.value) return
  if (
    currentIndex.value !== -1 &&
    panoramaScenes[currentIndex.value]?.n !== '航拍0563'
  ) {
    navStack.value.push(currentIndex.value)
  }
  currentStripFilter.value = null
  loadPanorama(idx, true)
}

function onSwitchClick() {
  const currentName = panoramaScenes[currentIndex.value]?.n
  const targetName = currentName === '佛法台' ? '普渡台' : '佛法台'
  const idx = panoramaScenes.findIndex((img) => img.n === targetName)
  if (idx !== -1 && idx !== currentIndex.value) loadPanorama(idx, true)
}

// ===== 标签面板 =====
function hideLabelPanel() {
  labelPanelShow.value = false
}

function showLabelPanel(data) {
  // 单场景标签直接跳转
  if (data.scenes && data.scenes.length === 1) {
    const idx = panoramaScenes.findIndex((img) => img.n === data.scenes[0])
    if (idx !== -1) {
      if (data.skipAerial) {
        if (currentIndex.value !== -1) navStack.value.push(currentIndex.value)
        currentStripFilter.value = null
        loadPanorama(idx, true)
      } else {
        jumpToScene(idx, data.scenes)
      }
      return
    }
  }
  labelPanelTitle.value = data.name || `标记${data.num}`
  if (!data.scenes || !data.scenes.length) {
    labelPanelScenes.value = []
  } else {
    labelPanelScenes.value = data.scenes
      .map((name) => {
        const idx = panoramaScenes.findIndex((img) => img.n === name)
        return { name, index: idx, names: data.scenes }
      })
      .filter((s) => s.index !== -1)
  }
  labelPanelShow.value = true
}

// ===== Viewer 点击事件：检测标签点击，带拖拽阈值防误触 =====
function onViewerPointerDown(e) {
  clickStartX = e.clientX
  clickStartY = e.clientY
}

function onViewerClick(e) {
  const dx = e.clientX - clickStartX
  const dy = e.clientY - clickStartY
  if (Math.sqrt(dx * dx + dy * dy) > 5) return
  const label = checkLabelClick(e.clientX, e.clientY)
  if (label) showLabelPanel(label)
}

// ===== 键盘快捷键 =====
function onKeyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    const next = (currentIndex.value + 1) % panoramaScenes.length
    loadPanorama(next, true)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    const prev =
      (currentIndex.value - 1 + panoramaScenes.length) % panoramaScenes.length
    loadPanorama(prev, true)
  }
}

// ===== 生命周期 =====
onMounted(() => {
  init()
  const startIdx = panoramaScenes.findIndex((img) => img.n === '航拍0563')
  loadPanorama(startIdx >= 0 ? startIdx : 0, false)

  viewerRef.value.addEventListener('pointerdown', onViewerPointerDown)
  viewerRef.value.addEventListener('click', onViewerClick)
  document.addEventListener('keydown', onKeyDown)
})

watch(currentIndex, () => {
  updateIntroPanel()
})

onUnmounted(() => {
  viewerRef.value?.removeEventListener('pointerdown', onViewerPointerDown)
  viewerRef.value?.removeEventListener('click', onViewerClick)
  document.removeEventListener('keydown', onKeyDown)
  disposePanorama()
})
</script>

<style scoped>
.panorama-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000;
  color: #fff;
  overflow: hidden;
}
.viewer {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}
.toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 6;
  display: flex;
  gap: 8px;
}
.toolbar-btn {
  padding: 5px 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 12px;
  text-decoration: none;
  transition: background 0.2s;
}
.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
