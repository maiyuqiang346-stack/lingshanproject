<template>
  <div class="lingshan-textbox" :class="{ open: isOpen }" @click="toggle">
    <div class="ltb-halo">
      <div class="ltb-halo-ring">
        <span class="ltb-halo-icon">&#9775;</span>
      </div>
    </div>
    <div class="ltb-body">
      <div class="ltb-shine"></div>
      <div class="ltb-header">
        <span class="ltb-title">&#10017; {{ title }}</span>
        <span class="ltb-arrow">&#9662;</span>
      </div>
      <div ref="contentRef" class="ltb-content" :style="contentStyle">
        <div class="ltb-inner">
          <div class="ltb-text" v-html="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const isOpen = ref(false);
const contentRef = ref(null);
const contentStyle = ref({});

function toggle() {
  if (isOpen.value) {
    const el = contentRef.value;
    if (el) {
      el.style.maxHeight = el.scrollHeight + 'px';
      requestAnimationFrame(() => {
        contentStyle.value = { maxHeight: '0px' };
        isOpen.value = false;
      });
    }
  } else {
    isOpen.value = true;
    nextTick(() => {
      const el = contentRef.value;
      if (el) {
        const maxH = Math.min(el.scrollHeight, window.innerHeight * 0.55)
        contentStyle.value = { maxHeight: maxH + 'px' }
      }
    });
  }
}
</script>

<style scoped>
.lingshan-textbox {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  animation: float 5s ease infinite;
}
.lingshan-textbox:hover {
  transform: scale(1.008);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.ltb-halo {
  display: flex;
  justify-content: center;
  margin-bottom: -28px;
  position: relative;
  z-index: 2;
}
.ltb-halo-ring {
  width: 90px;
  height: 90px;
  border: 3px solid #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: glow 3s ease infinite;
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.25); }
  50% { box-shadow: 0 0 35px rgba(212, 175, 55, 0.55); }
}
.ltb-halo-ring::before {
  content: '';
  position: absolute;
  inset: -10px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: ripple 3s ease infinite;
}
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
.ltb-halo-icon {
  font-size: 2.2em;
  color: #d4af37;
}

.ltb-body {
  background: linear-gradient(180deg, #2a2520 0%, #1a1712 100%);
  border: 2px solid #8b7355;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.ltb-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 40%);
  pointer-events: none;
}
.ltb-header {
  padding: 28px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(139, 115, 85, 0.25);
  position: relative;
  z-index: 1;
}
.ltb-title {
  font-size: 1.3em;
  color: #c9a84c;
  letter-spacing: 8px;
}
.ltb-arrow {
  color: #a89878;
  font-size: 1.4em;
  transition: transform 0.4s ease;
}
.lingshan-textbox.open .ltb-arrow {
  transform: rotate(180deg);
}
.ltb-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.lingshan-textbox.open .ltb-content {
  overflow-y: auto;
}
.ltb-content::-webkit-scrollbar {
  width: 5px;
}
.ltb-content::-webkit-scrollbar-track {
  background: rgba(139, 115, 85, 0.12);
  border-radius: 3px;
}
.ltb-content::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.45);
  border-radius: 3px;
}
.ltb-inner {
  padding: 32px 36px 40px;
  position: relative;
  z-index: 1;
}
.ltb-text {
  color: #e8dcc8;
  font-size: 22px;
  line-height: 2.6;
  letter-spacing: 3px;
  text-align: justify;
}
.ltb-text :deep(p) {
  margin-bottom: 1.2em;
  text-indent: 2em;
}

@media (max-width: 768px) {
  .ltb-inner { padding: 24px 22px 30px; }
  .ltb-text { font-size: 20px; line-height: 2.4; letter-spacing: 2px; }
  .ltb-title { letter-spacing: 4px; }
  .ltb-header { padding: 22px 24px; }
}
</style>
