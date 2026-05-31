<template>
  <div v-if="show" class="loading-screen">
    <img :src="bgSrc" class="bg" alt="loading">
    <div class="halo"></div>
    <div class="loading-center">
      <svg class="lotus" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#d4a017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 60 Q30 52 24 38 Q28 30 40 34 Q46 44 50 60"/>
          <path d="M50 60 Q70 52 76 38 Q72 30 60 34 Q54 44 50 60"/>
          <path d="M50 62 Q35 58 28 48 Q32 42 42 46 Q48 54 50 62"/>
          <path d="M50 62 Q65 58 72 48 Q68 42 58 46 Q52 54 50 62"/>
          <path d="M50 56 Q38 48 36 36 Q40 28 50 26 Q60 28 64 36 Q62 48 50 56"/>
          <path d="M50 56 Q42 50 40 40 Q44 34 50 32 Q56 34 60 40 Q58 50 50 56"/>
          <path d="M50 48 Q44 42 46 34 Q48 28 50 26 Q52 28 54 34 Q56 42 50 48"/>
          <path d="M50 48 Q46 44 48 36 Q50 32 50 32 Q50 32 52 36 Q54 44 50 48"/>
          <circle cx="50" cy="36" r="5" fill="rgba(212,160,23,0.15)"/>
          <circle cx="50" cy="36" r="2" fill="rgba(212,160,23,0.35)"/>
          <path d="M48 60 Q50 68 50 78" stroke-width="1.5" opacity="0.6"/>
          <path d="M52 60 Q50 68 50 78" stroke-width="1.5" opacity="0.6"/>
        </g>
      </svg>
      <div class="sutra-wrap">
        <span
          v-for="(sutra, i) in sutras"
          :key="i"
          class="sutra"
          :class="{ active: i === currentSutra }"
        >{{ sutra }}</span>
      </div>
      <span class="load-text">{{ text }}</span>
    </div>
    <div class="decor-bottom">卍 莲 卍</div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  show: Boolean,
  text: { type: String, default: '净土加载中...' }
});

const bgSrc = '/web/三王殿-b79e20d6fdbe.jpg';

const sutras = [
  '色即是空，空即是色',
  '照见五蕴皆空，度一切苦厄',
  '南无阿弥陀佛',
  '一花一世界，一叶一菩提',
  '凡所有相，皆是虚妄'
];
const currentSutra = ref(0);
let timer = null;

function startRotation() {
  stopRotation();
  currentSutra.value = 0;
  timer = setInterval(() => {
    currentSutra.value = (currentSutra.value + 1) % sutras.length;
  }, 4000);
}

function stopRotation() {
  if (timer) { clearInterval(timer); timer = null; }
}

watch(() => props.show, (val) => {
  if (val) startRotation();
  else stopRotation();
}, { immediate: true });

onBeforeUnmount(stopRotation);
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.loading-screen .bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: 0;
}
.lotus {
  width: 160px;
  height: 160px;
  animation: spinLotus 2s linear infinite;
  filter: drop-shadow(0 0 24px rgba(212,160,23,0.8));
  transform-origin: 50% 42%;
}
@keyframes spinLotus {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.loading-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50vh;
}
.sutra-wrap {
  position: relative;
  z-index: 1;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
}
.sutra {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: rgba(255,240,200,0.95);
  letter-spacing: 10px;
  text-shadow: 0 0 28px rgba(212,160,23,0.8);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 1.4s ease;
  font-family: "KaiTi", "STKaiti", "楷体", serif;
}
.sutra.active { opacity: 1; }
.load-text {
  position: relative;
  z-index: 1;
  font-size: 18px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 4px;
  margin-top: 14px;
}
.halo {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(212,160,23,0.18) 0%, rgba(212,160,23,0.05) 30%, transparent 60%);
  animation: haloPulse 3s ease-in-out infinite;
}
@keyframes haloPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}
.decor-bottom {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 36px;
  color: rgba(212,160,23,0.45);
  letter-spacing: 20px;
  white-space: nowrap;
}
</style>
