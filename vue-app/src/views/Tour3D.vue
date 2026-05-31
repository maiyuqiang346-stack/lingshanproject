<template>
  <div class="tour-page tour3d-page">
    <div class="bg-base"></div>

    <header class="tour-header">
      <button class="back-btn" @click="goBack" aria-label="返回首页">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>返回</span>
      </button>
      <h1 class="tour-title">3D 漫游</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="tour-content">
      <div class="placeholder-area">
        <div class="cube-icon">
          <svg viewBox="0 0 100 100" class="cube-svg">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30"
                     fill="none" stroke="var(--gold-primary)" stroke-width="1.5" opacity="0.6"/>
            <line x1="50" y1="10" x2="50" y2="90" stroke="var(--gold-primary)" stroke-width="1" opacity="0.3"/>
            <line x1="10" y1="30" x2="90" y2="70" stroke="var(--gold-primary)" stroke-width="1" opacity="0.3"/>
            <line x1="90" y1="30" x2="10" y2="70" stroke="var(--gold-primary)" stroke-width="1" opacity="0.3"/>
            <circle cx="50" cy="50" r="5" fill="var(--gold-primary)" opacity="0.5"/>
          </svg>
        </div>
        <h2 class="placeholder-title">3D 沉浸漫游</h2>
        <p class="placeholder-desc">三维交互体验，走进灵山深处<br>虚幻引擎渲染 · 即将上线</p>
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>UE5 内容准备中</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/home')
}
</script>

<style scoped>
.tour-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bg-base {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 120% 80% at 50% 40%, #5C1515 0%, #3A0D0D 40%, #1A0505 80%, #0D0202 100%);
  z-index: 0;
}

.tour-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(26, 5, 5, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(212, 168, 67, 0.15);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: 4px;
  color: var(--gold-primary);
  padding: 8px 16px;
  font-family: var(--font-accent);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1em;
}

.back-btn:hover {
  border-color: var(--gold-primary);
  background: rgba(212, 168, 67, 0.1);
}

.back-btn:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}

.tour-title {
  font-family: var(--font-title);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 400;
  color: var(--gold-light);
  letter-spacing: 0.2em;
  text-shadow: 0 0 20px rgba(212, 168, 67, 0.3);
}

.header-spacer {
  width: 90px;
}

.tour-content {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.cube-icon {
  width: 80px;
  height: 80px;
  animation: rotateCube 8s ease-in-out infinite;
}

@keyframes rotateCube {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.05); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.05); }
}

.cube-svg {
  width: 100%;
  height: 100%;
}

.placeholder-title {
  font-family: var(--font-title);
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 400;
  color: var(--cream);
  letter-spacing: 0.15em;
}

.placeholder-desc {
  font-family: var(--font-body);
  font-size: clamp(14px, 2vw, 16px);
  color: var(--cream-dim);
  text-align: center;
  line-height: 2;
  letter-spacing: 0.1em;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border: 1px solid rgba(212, 168, 67, 0.2);
  border-radius: 20px;
  font-family: var(--font-accent);
  font-size: 13px;
  color: var(--gold-primary);
  letter-spacing: 0.1em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold-primary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@media (prefers-reduced-motion: reduce) {
  .cube-icon { animation: none; }
  .status-dot { animation: none; opacity: 0.7; }
  .placeholder-area { animation: none; opacity: 1; }
}
</style>
