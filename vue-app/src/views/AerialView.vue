<template>
  <div class="aerial-view">
    <div ref="viewerRef" class="viewer">
      <FadeOverlay :active="switching" />
      <div class="scene-name">{{ currentSceneName }}</div>
      <div class="zoom-hint"></div>
      <router-link to="/panorama" class="back-btn" @pointerdown.stop>
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        返回全景
      </router-link>
      <div class="hint">拖拽平移 · 滚轮缩放</div>
      <div v-if="loading" class="loading-text">加载中...</div>
    </div>
    <ThumbnailStrip
      :items="stripItems"
      :active-index="currentIndex"
      @select="switchScene"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { aerialScenes } from '../data/aerialScenes.js';
import { useAerialViewer } from '../composables/useAerialViewer.js';
import FadeOverlay from '../components/FadeOverlay.vue';
import ThumbnailStrip from '../components/ThumbnailStrip.vue';

const viewerRef = ref(null);
const {
  currentIndex,
  switching,
  loading,
  switchScene,
  setupEvents,
} = useAerialViewer(viewerRef, aerialScenes);

const currentSceneName = computed(() => aerialScenes[currentIndex.value]?.n || '');

const stripItems = computed(() =>
  aerialScenes.map((img, i) => ({ ...img, index: i }))
);

onMounted(() => {
  setupEvents();
  switchScene(0);
});
</script>

<style scoped>
.aerial-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000;
  color: #fff;
}
.viewer {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
  cursor: grab;
  background: #000;
}
.viewer.dragging { cursor: grabbing; }
.scene-name {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 3;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.7);
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
  pointer-events: none;
}
.zoom-hint {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 3;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  pointer-events: none;
  transition: opacity 0.3s;
}
.back-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(20,10,0,0.65);
  border: 1.5px solid rgba(212,160,23,0.5);
  border-radius: 8px;
  color: #d4a017;
  font-size: 13px;
  text-decoration: none;
  letter-spacing: 1px;
  transition: all 0.25s;
  box-shadow: 0 0 12px rgba(212,160,23,0.15);
}
.back-btn:hover {
  background: rgba(40,20,0,0.85);
  border-color: rgba(212,160,23,0.8);
  color: #fff;
  box-shadow: 0 0 20px rgba(212,160,23,0.35);
}
.back-btn svg {
  width: 16px; height: 16px;
  stroke: currentColor;
  stroke-width: 2.5;
  fill: none;
  stroke-linecap: round; stroke-linejoin: round;
}
.hint {
  position: absolute;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  pointer-events: none;
  animation: fadeHint 4s ease 3s forwards;
}
@keyframes fadeHint { to { opacity: 0; } }
.loading-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  z-index: 4;
  pointer-events: none;
}
</style>
