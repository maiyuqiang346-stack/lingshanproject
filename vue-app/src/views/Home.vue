<template>
  <div class="home" ref="homeRef">
    <!-- Atmospheric background layers -->
    <div class="bg-base"></div>
    <div class="bg-photo bg-photo-left"></div>
    <div class="bg-photo bg-photo-center"></div>
    <div class="bg-photo bg-photo-right"></div>
    <div class="bg-mountains"></div>
    <div class="bg-mist"></div>

    <!-- Floating golden particles -->
    <div class="particles" ref="particlesRef">
      <div
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="p.style"
      ></div>
    </div>

    <!-- Floating lotus petals -->
    <div class="petals">
      <div
        v-for="petal in petalsList"
        :key="petal.id"
        class="petal"
        :style="petal.style"
      ></div>
    </div>

    <!-- 卍 Watermark -->
    <div class="wan-watermark">卍</div>

    <!-- Dharma Wheel background -->
    <div class="dharma-wheel-bg">
      <svg viewBox="0 0 200 200" class="dharma-wheel-svg">
        <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(212,168,67,0.08)" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(212,168,67,0.06)" stroke-width="1"/>
        <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(212,168,67,0.05)" stroke-width="1"/>
        <circle cx="100" cy="100" r="14" fill="none" stroke="rgba(212,168,67,0.1)" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="6" fill="rgba(212,168,67,0.08)"/>
        <line v-for="i in 8" :key="'spoke-'+i" :x1="100 + 16 * Math.cos((i-1)*Math.PI/4)" :y1="100 + 16 * Math.sin((i-1)*Math.PI/4)" :x2="100 + 92 * Math.cos((i-1)*Math.PI/4)" :y2="100 + 92 * Math.sin((i-1)*Math.PI/4)" stroke="rgba(212,168,67,0.07)" stroke-width="1.5"/>
        <circle v-for="i in 8" :key="'node-'+i" :cx="100 + 75 * Math.cos((i-1)*Math.PI/4)" :cy="100 + 75 * Math.sin((i-1)*Math.PI/4)" r="3" fill="rgba(212,168,67,0.06)"/>
      </svg>
    </div>

    <!-- Buddha Light Rays -->
    <div class="buddha-light">
      <div class="light-ray" v-for="i in 12" :key="'ray-'+i" :style="{ '--angle': `${(i-1) * 30}deg`, '--delay': `${i * 0.3}s` }"></div>
    </div>

    <!-- Incense smoke -->
    <div class="incense-smoke">
      <div class="smoke-wisp smoke-wisp-1"></div>
      <div class="smoke-wisp smoke-wisp-2"></div>
      <div class="smoke-wisp smoke-wisp-3"></div>
    </div>

    <!-- Top decorative border -->
    <div class="frame-top">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path d="M0,80 L0,30 Q100,0 200,30 Q300,60 400,30 Q500,0 600,30 Q700,60 800,30 Q900,0 1000,30 Q1100,60 1200,30 L1200,80 Z"
              fill="var(--temple-red-dark)" opacity="0.7"/>
        <path d="M0,80 L0,40 Q100,15 200,40 Q300,65 400,40 Q500,15 600,40 Q700,65 800,40 Q900,15 1000,40 Q1100,65 1200,40 L1200,80 Z"
              fill="var(--gold-primary)" opacity="0.12"/>
        <line x1="80" y1="60" x2="1120" y2="60" stroke="var(--gold-primary)" stroke-width="0.5" opacity="0.2"/>
        <text v-for="i in 11" :key="'tw-'+i" :x="50 + (i-1)*110" y="52" text-anchor="middle" fill="var(--gold-primary)" font-size="14" opacity="0.15" font-family="serif">卍</text>
      </svg>
    </div>

    <!-- Bottom decorative border -->
    <div class="frame-bottom">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path d="M0,0 L0,50 Q100,80 200,50 Q300,20 400,50 Q500,80 600,50 Q700,20 800,50 Q900,80 1000,50 Q1100,20 1200,50 L1200,0 Z"
              fill="var(--temple-red-dark)" opacity="0.7"/>
        <path d="M0,0 L0,45 Q100,70 200,45 Q300,20 400,45 Q500,70 600,45 Q700,20 800,45 Q900,70 1000,45 Q1100,20 1200,45 L1200,0 Z"
              fill="var(--gold-primary)" opacity="0.12"/>
        <line x1="80" y1="20" x2="1120" y2="20" stroke="var(--gold-primary)" stroke-width="0.5" opacity="0.2"/>
        <text v-for="i in 11" :key="'bw-'+i" :x="50 + (i-1)*110" y="28" text-anchor="middle" fill="var(--gold-primary)" font-size="14" opacity="0.15" font-family="serif">卍</text>
      </svg>
    </div>

    <!-- Left decorative pillar -->
    <div class="frame-left">
      <div class="pillar-cap pillar-cap-top">
        <svg viewBox="0 0 160 60" preserveAspectRatio="none">
          <rect x="5" y="35" width="150" height="20" rx="3" fill="var(--temple-red-dark)" opacity="0.75"/>
          <rect x="18" y="20" width="124" height="17" rx="2" fill="var(--temple-red-dark)" opacity="0.55"/>
          <rect x="35" y="8" width="90" height="14" rx="2" fill="var(--temple-red-dark)" opacity="0.4"/>
          <line x1="10" y1="42" x2="150" y2="42" stroke="var(--gold-primary)" stroke-width="0.8" opacity="0.25"/>
          <line x1="22" y1="28" x2="138" y2="28" stroke="var(--gold-primary)" stroke-width="0.6" opacity="0.2"/>
        </svg>
      </div>
      <div class="pillar-body">
        <div class="pillar-edge-line pillar-edge-left"></div>
        <div class="pillar-center">
          <div class="pillar-vline"></div>
          <div class="pillar-symbols">
            <span>卍</span><span>☸</span><span>❀</span><span>卍</span><span>☸</span>
            <span>❀</span><span>卍</span><span>☸</span><span>❀</span><span>卍</span>
            <span>☸</span><span>❀</span><span>卍</span><span>☸</span><span>❀</span>
            <span>卍</span><span>☸</span><span>❀</span>
          </div>
          <div class="pillar-vline"></div>
        </div>
        <div class="pillar-edge-line pillar-edge-right"></div>
      </div>
      <div class="pillar-cap pillar-cap-bottom">
        <svg viewBox="0 0 160 60" preserveAspectRatio="none">
          <rect x="5" y="5" width="150" height="20" rx="3" fill="var(--temple-red-dark)" opacity="0.75"/>
          <rect x="18" y="23" width="124" height="17" rx="2" fill="var(--temple-red-dark)" opacity="0.55"/>
          <rect x="35" y="38" width="90" height="14" rx="2" fill="var(--temple-red-dark)" opacity="0.4"/>
          <line x1="10" y1="18" x2="150" y2="18" stroke="var(--gold-primary)" stroke-width="0.8" opacity="0.25"/>
          <line x1="22" y1="32" x2="138" y2="32" stroke="var(--gold-primary)" stroke-width="0.6" opacity="0.2"/>
        </svg>
      </div>
    </div>

    <!-- Right decorative pillar -->
    <div class="frame-right">
      <div class="pillar-cap pillar-cap-top">
        <svg viewBox="0 0 160 60" preserveAspectRatio="none">
          <rect x="5" y="35" width="150" height="20" rx="3" fill="var(--temple-red-dark)" opacity="0.75"/>
          <rect x="18" y="20" width="124" height="17" rx="2" fill="var(--temple-red-dark)" opacity="0.55"/>
          <rect x="35" y="8" width="90" height="14" rx="2" fill="var(--temple-red-dark)" opacity="0.4"/>
          <line x1="10" y1="42" x2="150" y2="42" stroke="var(--gold-primary)" stroke-width="0.8" opacity="0.25"/>
          <line x1="22" y1="28" x2="138" y2="28" stroke="var(--gold-primary)" stroke-width="0.6" opacity="0.2"/>
        </svg>
      </div>
      <div class="pillar-body">
        <div class="pillar-edge-line pillar-edge-left"></div>
        <div class="pillar-center">
          <div class="pillar-vline"></div>
          <div class="pillar-symbols">
            <span>❀</span><span>☸</span><span>卍</span><span>❀</span><span>☸</span>
            <span>卍</span><span>❀</span><span>☸</span><span>卍</span><span>❀</span>
            <span>☸</span><span>卍</span><span>❀</span><span>☸</span><span>卍</span>
            <span>❀</span><span>☸</span><span>卍</span>
          </div>
          <div class="pillar-vline"></div>
        </div>
        <div class="pillar-edge-line pillar-edge-right"></div>
      </div>
      <div class="pillar-cap pillar-cap-bottom">
        <svg viewBox="0 0 160 60" preserveAspectRatio="none">
          <rect x="5" y="5" width="150" height="20" rx="3" fill="var(--temple-red-dark)" opacity="0.75"/>
          <rect x="18" y="23" width="124" height="17" rx="2" fill="var(--temple-red-dark)" opacity="0.55"/>
          <rect x="35" y="38" width="90" height="14" rx="2" fill="var(--temple-red-dark)" opacity="0.4"/>
          <line x1="10" y1="18" x2="150" y2="18" stroke="var(--gold-primary)" stroke-width="0.8" opacity="0.25"/>
          <line x1="22" y1="32" x2="138" y2="32" stroke="var(--gold-primary)" stroke-width="0.6" opacity="0.2"/>
        </svg>
      </div>
    </div>

    <!-- Corner ornaments -->
    <div class="corner-ornament corner-tl"></div>
    <div class="corner-ornament corner-tr"></div>
    <div class="corner-ornament corner-bl"></div>
    <div class="corner-ornament corner-br"></div>

    <!-- Main content -->
    <div class="content">
        <!-- Header with title -->
        <header class="header">
          <div class="ornament ornament-left">
            <svg viewBox="0 0 120 40" class="ornament-svg">
              <path d="M120,20 Q90,0 60,20 Q30,40 0,20" stroke="var(--gold-primary)" fill="none" stroke-width="1.5" opacity="0.7"/>
              <path d="M110,20 Q80,5 50,20 Q20,35 0,20" stroke="var(--gold-light)" fill="none" stroke-width="1" opacity="0.4"/>
              <circle cx="0" cy="20" r="3" fill="var(--gold-primary)" opacity="0.8"/>
              <circle cx="60" cy="20" r="2" fill="var(--gold-light)" opacity="0.5"/>
            </svg>
          </div>

          <div class="title-group">
            <div class="subtitle">—— 佛光普照 · 灵山胜境 ——</div>
            <h1 class="title">灵山胜境</h1>
            <div class="mantra-line">唵嘛呢叭咪吽</div>
            <div class="title-decoration">
              <span class="deco-line"></span>
              <span class="deco-symbol">☸</span>
              <span class="deco-lotus">❀</span>
              <span class="deco-symbol">☸</span>
              <span class="deco-line"></span>
            </div>
            <p class="tagline">江南福地 · 佛教圣地 · 人间净土</p>
            <div class="buddhist-couplet">
              <span class="couplet-left">山不在高有佛则名</span>
              <span class="couplet-separator">卍</span>
              <span class="couplet-right">水不在深有禅则灵</span>
            </div>
          </div>

          <div class="ornament ornament-right">
            <svg viewBox="0 0 120 40" class="ornament-svg">
              <path d="M0,20 Q30,0 60,20 Q90,40 120,20" stroke="var(--gold-primary)" fill="none" stroke-width="1.5" opacity="0.7"/>
              <path d="M10,20 Q40,5 70,20 Q100,35 120,20" stroke="var(--gold-light)" fill="none" stroke-width="1" opacity="0.4"/>
              <circle cx="120" cy="20" r="3" fill="var(--gold-primary)" opacity="0.8"/>
              <circle cx="60" cy="20" r="2" fill="var(--gold-light)" opacity="0.5"/>
            </svg>
          </div>
        </header>

        <!-- Sutra scroll -->
        <div class="sutra-scroll">
          <div class="sutra-track">
            <span class="sutra-text" v-for="(sutra, i) in [...sutraList, ...sutraList]" :key="i">{{ sutra }}</span>
          </div>
        </div>

        <!-- Navigation cards -->
        <nav class="nav-cards">
          <div class="card card-panorama" @click="navigateTo('PanoramaTour')" tabindex="0"
               @keydown.enter="navigateTo('PanoramaTour')" @keydown.space.prevent="navigateTo('PanoramaTour')">
            <div class="card-glow"></div>
            <div class="card-border-ornament top-left"></div>
            <div class="card-border-ornament top-right"></div>
            <div class="card-border-ornament bottom-left"></div>
            <div class="card-border-ornament bottom-right"></div>

            <div class="card-icon">
              <svg viewBox="0 0 80 80" class="icon-svg">
                <circle cx="40" cy="40" r="30" fill="none" stroke="var(--gold-light)" stroke-width="2" opacity="0.6"/>
                <ellipse cx="40" cy="40" rx="30" ry="12" fill="none" stroke="var(--gold-primary)" stroke-width="2"/>
                <ellipse cx="40" cy="40" rx="18" ry="12" fill="none" stroke="var(--gold-primary)" stroke-width="1.5"/>
                <circle cx="40" cy="40" r="4" fill="var(--gold-bright)"/>
                <line x1="40" y1="10" x2="40" y2="16" stroke="var(--gold-light)" stroke-width="1" opacity="0.5"/>
                <line x1="40" y1="64" x2="40" y2="70" stroke="var(--gold-light)" stroke-width="1" opacity="0.5"/>
              </svg>
            </div>

            <h2 class="card-title">全景漫游</h2>
            <p class="card-desc">身临其境，纵览灵山全貌<br>360°全景视角，尽享胜境风光</p>
            <div class="card-action">
              <span class="action-text">开始游览</span>
              <span class="action-arrow">→</span>
            </div>
          </div>

          <div class="card card-3dtour" @click="navigateTo('Tour3D')" tabindex="0"
               @keydown.enter="navigateTo('Tour3D')" @keydown.space.prevent="navigateTo('Tour3D')">
            <div class="card-glow"></div>
            <div class="card-border-ornament top-left"></div>
            <div class="card-border-ornament top-right"></div>
            <div class="card-border-ornament bottom-left"></div>
            <div class="card-border-ornament bottom-right"></div>

            <div class="card-icon">
              <svg viewBox="0 0 80 80" class="icon-svg">
                <polygon points="40,10 70,25 70,55 40,70 10,55 10,25"
                         fill="none" stroke="var(--gold-primary)" stroke-width="2"/>
                <line x1="40" y1="10" x2="40" y2="70" stroke="var(--gold-light)" stroke-width="1" opacity="0.4"/>
                <line x1="10" y1="25" x2="70" y2="55" stroke="var(--gold-light)" stroke-width="1" opacity="0.3"/>
                <line x1="70" y1="25" x2="10" y2="55" stroke="var(--gold-light)" stroke-width="1" opacity="0.3"/>
                <circle cx="40" cy="40" r="3" fill="var(--gold-bright)"/>
              </svg>
            </div>

            <h2 class="card-title">3D 漫游</h2>
            <p class="card-desc">沉浸体验，走进灵山深处<br>三维交互漫游，感受佛国庄严</p>
            <div class="card-action">
              <span class="action-text">开始游览</span>
              <span class="action-arrow">→</span>
            </div>
          </div>
        </nav>

        <!-- Bottom info -->
        <footer class="footer">
          <div class="footer-cloud">
            <svg viewBox="0 0 600 40" preserveAspectRatio="none">
              <path d="M0,40 Q75,10 150,25 Q225,40 300,20 Q375,0 450,25 Q525,40 600,15"
                    stroke="var(--gold-primary)" fill="none" stroke-width="1" opacity="0.3"/>
            </svg>
          </div>
          <div class="footer-symbols">
            <span>卍</span>
            <span>莲</span>
            <span>佛</span>
            <span>禅</span>
            <span>莲</span>
            <span>卍</span>
          </div>
          <p class="footer-text">灵山胜境景区 · 数字化体验平台</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeRef = ref(null)
const particlesRef = ref(null)

const particles = reactive([])
const petalsList = reactive([])

const sutraList = [
  '色即是空，空即是色',
  '照见五蕴皆空，度一切苦厄',
  '一花一世界，一叶一菩提',
  '凡所有相，皆是虚妄',
  '菩提本无树，明镜亦非台',
  '本来无一物，何处惹尘埃',
  '南无阿弥陀佛',
  '心无挂碍，无挂碍故，无有恐怖',
  '远离颠倒梦想，究竟涅槃',
]

function generateParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      id: `p-${i}`,
      style: {
        '--px': `${Math.random() * 100}%`,
        '--py': `${Math.random() * 100}%`,
        '--size': `${2 + Math.random() * 4}px`,
        '--duration': `${8 + Math.random() * 12}s`,
        '--delay': `${Math.random() * 10}s`,
        '--drift': `${-30 + Math.random() * 60}px`,
        '--opacity': `${0.2 + Math.random() * 0.5}`
      }
    })
  }
}

function generatePetals(count) {
  for (let i = 0; i < count; i++) {
    petalsList.push({
      id: `petal-${i}`,
      style: {
        '--px': `${Math.random() * 100}%`,
        '--duration': `${15 + Math.random() * 20}s`,
        '--delay': `${Math.random() * 15}s`,
        '--drift': `${-40 + Math.random() * 80}px`,
        '--rotate': `${Math.random() * 360}deg`,
        '--size': `${8 + Math.random() * 12}px`,
        '--opacity': `${0.15 + Math.random() * 0.25}`
      }
    })
  }
}

function navigateTo(name) {
  if (name === 'PanoramaTour') {
    router.push('/panorama')
  } else {
    router.push({ name })
  }
}

let resizeHandler = null

onMounted(() => {
  generateParticles(40)
  generatePetals(12)
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== Background Layers ===== */
.bg-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% 40%, #5C1515 0%, #3A0D0D 40%, #1A0505 80%, #0D0202 100%);
  z-index: 0;
}

.bg-photo {
  position: absolute;
  background-size: cover;
  background-position: center;
  z-index: 0;
  opacity: 0.45;
  filter: saturate(0.8) brightness(1.1);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.bg-photo-left {
  width: 35%;
  height: 50%;
  left: 0;
  bottom: 0;
  background-image: url('/images/scene1.png');
  mask-image: radial-gradient(ellipse 100% 100% at 20% 70%, black 15%, transparent 65%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 20% 70%, black 15%, transparent 65%);
}

.bg-photo-center {
  width: 40%;
  height: 35%;
  left: 50%;
  top: 60%;
  transform: translateX(-50%);
  background-image: url('/images/scene3.png');
  mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 70%);
}

.bg-photo-right {
  width: 35%;
  height: 50%;
  right: 0;
  bottom: 0;
  background-image: url('/images/scene2.png');
  mask-image: radial-gradient(ellipse 100% 100% at 80% 70%, black 15%, transparent 65%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 80% 70%, black 15%, transparent 65%);
}

.bg-mountains {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.12;
  background:
    radial-gradient(ellipse 60% 25% at 20% 85%, var(--gold-primary) 0%, transparent 70%),
    radial-gradient(ellipse 50% 20% at 80% 80%, var(--gold-primary) 0%, transparent 70%),
    radial-gradient(ellipse 80% 30% at 50% 95%, var(--temple-red) 0%, transparent 60%);
}

.bg-mist {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(ellipse 100% 40% at 50% 30%, rgba(212, 168, 67, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 80% 30% at 30% 70%, rgba(212, 168, 67, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 80% 30% at 70% 60%, rgba(232, 180, 184, 0.03) 0%, transparent 60%);
  animation: mistDrift 20s ease-in-out infinite alternate;
}

@keyframes mistDrift {
  0% { transform: translateX(-2%) scaleY(1); }
  100% { transform: translateX(2%) scaleY(1.05); }
}

/* ===== Particles ===== */
.particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--px);
  top: var(--py);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle, var(--gold-bright), var(--gold-primary));
  opacity: var(--opacity);
  animation: particleFloat var(--duration) var(--delay) ease-in-out infinite;
  box-shadow: 0 0 6px var(--shadow-gold);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: var(--opacity);
  }
  25% {
    transform: translateY(-40px) translateX(var(--drift));
    opacity: calc(var(--opacity) * 1.5);
  }
  50% {
    transform: translateY(-80px) translateX(calc(var(--drift) * -0.5));
    opacity: var(--opacity);
  }
  75% {
    transform: translateY(-40px) translateX(calc(var(--drift) * 0.8));
    opacity: calc(var(--opacity) * 0.8);
  }
}

/* ===== Lotus Petals ===== */
.petals {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.petal {
  position: absolute;
  left: var(--px);
  top: -20px;
  width: var(--size);
  height: var(--size);
  opacity: var(--opacity);
  animation: petalFall var(--duration) var(--delay) linear infinite;
}

.petal::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 50%, var(--lotus-pink), rgba(232, 180, 184, 0.3));
  border-radius: 50% 0 50% 0;
  transform: rotate(var(--rotate));
}

@keyframes petalFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
  }
  90% {
    opacity: var(--opacity);
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(720deg);
    opacity: 0;
  }
}

/* ===== Decorative Borders ===== */
.border-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 5;
  pointer-events: none;
}

.border-top svg {
  width: 100%;
  height: 100%;
}

.border-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 5;
  pointer-events: none;
}

.border-bottom svg {
  width: 100%;
  height: 100%;
}

/* ===== Center Content ===== */
.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: clamp(65px, 12vh, 130px) clamp(130px, 17vw, 320px) clamp(35px, 7vh, 90px);
  gap: 36px;
  animation: contentReveal 1.5s ease-out;
}

@keyframes contentReveal {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  text-align: center;
}

.ornament {
  flex: 0 0 120px;
  height: 40px;
  opacity: 0;
  animation: ornamentReveal 1s 0.5s ease-out forwards;
}

.ornament-right {
  transform: scaleX(-1);
}

@keyframes ornamentReveal {
  to { opacity: 1; }
}

.ornament-svg {
  width: 100%;
  height: 100%;
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.subtitle {
  font-family: var(--font-accent);
  font-size: clamp(14px, 2vw, 18px);
  color: var(--gold-primary);
  letter-spacing: 0.4em;
  opacity: 0;
  animation: subtitleIn 1s 0.3s ease-out forwards;
}

@keyframes subtitleIn {
  0% { opacity: 0; letter-spacing: 0.1em; }
  100% { opacity: 0.85; letter-spacing: 0.4em; }
}

.title {
  font-family: var(--font-title);
  font-size: clamp(52px, 10vw, 108px);
  font-weight: 400;
  color: var(--cream);
  letter-spacing: 0.15em;
  line-height: 1.1;
  text-shadow:
    0 0 40px rgba(212, 168, 67, 0.4),
    0 0 80px rgba(212, 168, 67, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  opacity: 0;
  animation: titleIn 1.2s 0.1s ease-out forwards;
}

@keyframes titleIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(8px);
  }
  60% {
    opacity: 1;
    transform: scale(1.02);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.title-decoration {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  animation: decoIn 1s 0.8s ease-out forwards;
}

@keyframes decoIn {
  to { opacity: 1; }
}

.deco-line {
  display: block;
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
}

.deco-lotus {
  font-size: 16px;
  color: var(--gold-primary);
  opacity: 0.7;
}

.tagline {
  font-family: var(--font-accent);
  font-size: clamp(13px, 1.8vw, 16px);
  color: var(--cream-dim);
  letter-spacing: 0.3em;
  opacity: 0;
  animation: taglineIn 1s 1s ease-out forwards;
}

@keyframes taglineIn {
  to { opacity: 0.7; }
}

/* ===== Navigation Cards ===== */
.nav-cards {
  display: flex;
  gap: 40px;
  width: 100%;
  max-width: 860px;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  position: relative;
  flex: 1 1 340px;
  max-width: 400px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 48px 32px 40px;
  background: linear-gradient(
    170deg,
    rgba(90, 20, 20, 0.85) 0%,
    rgba(50, 12, 12, 0.9) 50%,
    rgba(30, 8, 8, 0.95) 100%
  );
  border: 1px solid rgba(212, 168, 67, 0.25);
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  animation: cardIn 0.8s ease-out backwards;
}

.card-panorama { animation-delay: 1.2s; }
.card-3dtour { animation-delay: 1.4s; }

@keyframes cardIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212, 168, 67, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212, 168, 67, 0.05) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover::before,
.card:focus-visible::before {
  opacity: 1;
}

.card:hover,
.card:focus-visible {
  border-color: rgba(212, 168, 67, 0.5);
  transform: translateY(-6px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(212, 168, 67, 0.1),
    inset 0 1px 0 rgba(212, 168, 67, 0.1);
}

.card:active {
  transform: translateY(-2px);
  transition-duration: 0.1s;
}

.card:focus-visible {
  box-shadow:
    0 0 0 3px var(--gold-primary),
    0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Card glow effect */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(212, 168, 67, 0.06), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.card:hover .card-glow,
.card:focus-visible .card-glow {
  opacity: 1;
}

/* Corner ornaments */
.card-border-ornament {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.card:hover .card-border-ornament,
.card:focus-visible .card-border-ornament {
  opacity: 0.8;
}

.card-border-ornament::before,
.card-border-ornament::after {
  content: '';
  position: absolute;
  background: var(--gold-primary);
}

.top-left { top: 8px; left: 8px; }
.top-right { top: 8px; right: 8px; }
.bottom-left { bottom: 8px; left: 8px; }
.bottom-right { bottom: 8px; right: 8px; }

.top-left::before, .bottom-left::before { left: 0; width: 1px; height: 100%; }
.top-left::after, .top-right::after { top: 0; height: 1px; width: 100%; }
.top-right::before, .bottom-right::before { right: 0; width: 1px; height: 100%; }
.bottom-left::after, .bottom-right::after { bottom: 0; height: 1px; width: 100%; }

/* Card icon */
.card-icon {
  width: 80px;
  height: 80px;
  opacity: 0.85;
  transition: all 0.4s ease;
}

.card:hover .card-icon,
.card:focus-visible .card-icon {
  opacity: 1;
  transform: scale(1.08);
}

.icon-svg {
  width: 100%;
  height: 100%;
}

/* Card title */
.card-title {
  font-family: var(--font-title);
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 400;
  color: var(--gold-light);
  letter-spacing: 0.2em;
  text-shadow: 0 0 20px rgba(212, 168, 67, 0.3);
  transition: all 0.3s ease;
}

.card:hover .card-title,
.card:focus-visible .card-title {
  color: var(--gold-bright);
  text-shadow: 0 0 30px rgba(212, 168, 67, 0.5);
}

/* Card description */
.card-desc {
  font-family: var(--font-body);
  font-size: clamp(13px, 1.6vw, 15px);
  color: var(--cream-dim);
  line-height: 1.8;
  text-align: center;
  letter-spacing: 0.08em;
  transition: color 0.3s ease;
}

.card:hover .card-desc,
.card:focus-visible .card-desc {
  color: var(--cream);
}

/* Card action */
.card-action {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.card:hover .card-action,
.card:focus-visible .card-action {
  opacity: 1;
  gap: 14px;
}

.action-text {
  font-family: var(--font-accent);
  font-size: 15px;
  color: var(--gold-primary);
  letter-spacing: 0.15em;
}

.action-arrow {
  font-size: 18px;
  color: var(--gold-primary);
  transition: transform 0.3s ease;
}

.card:hover .action-arrow,
.card:focus-visible .action-arrow {
  transform: translateX(4px);
}

/* ===== Footer ===== */
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  animation: footerIn 1s 1.6s ease-out forwards;
}

@keyframes footerIn {
  to { opacity: 1; }
}

.footer-cloud {
  width: 200px;
  height: 20px;
  opacity: 0.5;
}

.footer-cloud svg {
  width: 100%;
  height: 100%;
}

.footer-text {
  font-family: var(--font-accent);
  font-size: 13px;
  color: var(--cream-dim);
  letter-spacing: 0.25em;
  opacity: 0.5;
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .content {
    padding: clamp(80px, 12vh, 130px) clamp(60px, 10vw, 160px) clamp(60px, 7vh, 90px);
    gap: 36px;
  }

  .ornament {
    display: none;
  }

  .nav-cards {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .card {
    max-width: 100%;
    min-height: 260px;
    padding: 36px 24px 32px;
  }

  .frame-left, .frame-right {
    width: clamp(60px, 10vw, 140px);
  }

  .pillar-symbols span {
    font-size: clamp(12px, 1.4vw, 18px);
  }

  .pillar-edge-line {
    width: 1px;
  }

  .corner-ornament {
    width: 40px;
    height: 40px;
  }

  .corner-ornament::before { width: 28px; }
  .corner-ornament::after { height: 28px; }
}

@media (max-width: 600px) {
  .content {
    gap: 28px;
    padding: clamp(80px, 12vh, 130px) 20px clamp(60px, 7vh, 90px);
  }

  .frame-left, .frame-right {
    width: 24px;
  }

  .pillar-symbols { display: none; }
  .pillar-edge-line { display: none; }
  .pillar-vline { display: none; }
  .corner-ornament { display: none; }

  .card {
    min-height: 240px;
    padding: 28px 20px 24px;
    gap: 16px;
  }

  .card-icon {
    width: 64px;
    height: 64px;
  }

  .subtitle {
    letter-spacing: 0.2em;
  }

  .tagline {
    letter-spacing: 0.15em;
  }
}

@media (max-width: 400px) {
  .frame-left, .frame-right {
    display: none;
  }
}

/* ===== Accessibility: Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .petal,
  .bg-mist,
  .smoke-wisp,
  .dharma-wheel-bg,
  .light-ray {
    animation: none !important;
  }

  .content,
  .subtitle,
  .title,
  .title-decoration,
  .tagline,
  .ornament,
  .card,
  .footer {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .card {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .sutra-track {
    animation: none !important;
  }

  .pillar-symbols span {
    animation: none !important;
    opacity: 0.15 !important;
  }

  .wan-watermark {
    animation: none !important;
  }
}

/* ===== 卍 Watermark ===== */
.wan-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(250px, 40vw, 500px);
  color: rgba(212, 168, 67, 0.04);
  z-index: 1;
  pointer-events: none;
  font-family: serif;
  line-height: 1;
  animation: wanPulse 15s ease-in-out infinite;
}

@keyframes wanPulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.03); }
}

/* ===== Decorative Frame ===== */
.frame-top { position: absolute; top: 0; left: 0; right: 0; height: clamp(55px, 11vh, 120px); z-index: 5; pointer-events: none; }
.frame-top svg { width: 100%; height: 100%; }
.frame-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: clamp(28px, 6vh, 80px); z-index: 5; pointer-events: none; }
.frame-bottom svg { width: 100%; height: 100%; }

.frame-left, .frame-right { position: absolute; top: clamp(55px, 11vh, 120px); bottom: clamp(28px, 6vh, 80px); width: clamp(120px, 16vw, 300px); z-index: 5; pointer-events: none; display: flex; flex-direction: column; align-items: center; }
.frame-left { left: 0; }
.frame-right { right: 0; }

.pillar-cap { width: 100%; flex-shrink: 0; }
.pillar-cap svg { width: 100%; height: auto; }
.pillar-body { flex: 1; display: flex; align-items: stretch; width: 100%; position: relative; overflow: hidden; }
.pillar-edge-line { width: 2px; flex-shrink: 0; background: linear-gradient(to bottom, rgba(212,168,67,0.15), rgba(212,168,67,0.3), rgba(212,168,67,0.15)); }
.pillar-center { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
.pillar-vline { position: absolute; top: 0; bottom: 0; width: 1.5px; background: linear-gradient(to bottom, rgba(212,168,67,0.1), rgba(212,168,67,0.25), rgba(212,168,67,0.1)); }
.pillar-vline:first-child { left: 20%; }
.pillar-vline:last-child { right: 20%; }
.pillar-symbols { display: flex; flex-direction: column; align-items: center; gap: clamp(18px, 3.5vh, 32px); position: relative; z-index: 1; }
.pillar-symbols span { font-size: clamp(14px, 1.8vw, 22px); color: var(--gold-primary); opacity: 0.2; writing-mode: vertical-rl; animation: symbolPulse 6s ease-in-out infinite alternate; }
.pillar-symbols span:nth-child(odd) { animation-delay: -3s; }
@keyframes symbolPulse { 0% { opacity: 0.12; } 100% { opacity: 0.3; } }

.corner-ornament { position: absolute; width: 60px; height: 60px; z-index: 6; pointer-events: none; }
.corner-ornament::before, .corner-ornament::after { content: ''; position: absolute; background: var(--gold-primary); opacity: 0.3; }
.corner-tl { top: clamp(55px, 11vh, 120px); left: clamp(120px, 16vw, 300px); }
.corner-tr { top: clamp(55px, 11vh, 120px); right: clamp(120px, 16vw, 300px); transform: scaleX(-1); }
.corner-bl { bottom: clamp(28px, 6vh, 80px); left: clamp(120px, 16vw, 300px); transform: scaleY(-1); }
.corner-br { bottom: clamp(28px, 6vh, 80px); right: clamp(120px, 16vw, 300px); transform: scale(-1); }
.corner-ornament::before { top: 0; left: 0; width: 40px; height: 2px; }
.corner-ornament::after { top: 0; left: 0; width: 2px; height: 40px; }

/* ===== Dharma Wheel Background ===== */
.dharma-wheel-bg {
  position: absolute;
  top: 45%;
  left: 50%;
  width: clamp(350px, 45vw, 550px);
  height: clamp(350px, 45vw, 550px);
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  animation: wheelRotate 150s linear infinite;
}

.dharma-wheel-svg {
  width: 100%;
  height: 100%;
}

@keyframes wheelRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ===== Buddha Light Rays ===== */
.buddha-light {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 1;
  pointer-events: none;
}

.light-ray {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: clamp(200px, 30vh, 400px);
  background: linear-gradient(to bottom, rgba(212, 168, 67, 0.18), rgba(212, 168, 67, 0.04), transparent);
  transform-origin: top center;
  transform: rotate(var(--angle));
  opacity: 0;
  animation: rayPulse 6s var(--delay) ease-in-out infinite;
}

@keyframes rayPulse {
  0%, 100% { opacity: 0; }
  30% { opacity: 0.6; }
  60% { opacity: 0.3; }
}

/* ===== Incense Smoke ===== */
.incense-smoke {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.smoke-wisp {
  position: absolute;
  bottom: -10%;
  opacity: 0;
}

.smoke-wisp-1 {
  left: 25%;
  width: 50px;
  height: 120%;
  background: linear-gradient(to top, rgba(212, 168, 67, 0.06), rgba(212, 168, 67, 0.01), transparent);
  filter: blur(30px);
  animation: smokeRise 12s 0s ease-in-out infinite;
}

.smoke-wisp-2 {
  left: 50%;
  width: 40px;
  height: 120%;
  background: linear-gradient(to top, rgba(212, 168, 67, 0.05), rgba(212, 168, 67, 0.01), transparent);
  filter: blur(35px);
  animation: smokeRise 16s 4s ease-in-out infinite;
}

.smoke-wisp-3 {
  left: 72%;
  width: 35px;
  height: 120%;
  background: linear-gradient(to top, rgba(232, 180, 184, 0.04), rgba(232, 180, 184, 0.01), transparent);
  filter: blur(28px);
  animation: smokeRise 14s 8s ease-in-out infinite;
}

@keyframes smokeRise {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  15% { opacity: 0.4; }
  50% { transform: translateY(-25%) scaleX(2.5); opacity: 0.25; }
  85% { opacity: 0.08; }
  100% { transform: translateY(-55%) scaleX(4); opacity: 0; }
}

/* ===== Mantra Line ===== */
.mantra-line {
  font-family: var(--font-accent);
  font-size: clamp(16px, 2.5vw, 22px);
  color: var(--gold-primary);
  letter-spacing: 0.6em;
  opacity: 0;
  text-shadow: 0 0 20px rgba(212, 168, 67, 0.3);
  animation: mantraIn 1.5s 0.6s ease-out forwards;
}

@keyframes mantraIn {
  0% { opacity: 0; letter-spacing: 0.2em; }
  100% { opacity: 0.55; letter-spacing: 0.6em; }
}

/* ===== Deco Symbol ===== */
.deco-symbol {
  font-size: 14px;
  color: var(--gold-primary);
  opacity: 0.5;
}

/* ===== Buddhist Couplet ===== */
.buddhist-couplet {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  opacity: 0;
  animation: coupletIn 1.2s 1.1s ease-out forwards;
}

@keyframes coupletIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.couplet-left,
.couplet-right {
  font-family: var(--font-title);
  font-size: clamp(13px, 1.6vw, 16px);
  color: var(--gold-light);
  letter-spacing: 0.2em;
  opacity: 0.5;
  writing-mode: horizontal-tb;
}

.couplet-separator {
  font-size: 14px;
  color: var(--gold-primary);
  opacity: 0.4;
}

/* ===== Sutra Scroll ===== */
.sutra-scroll {
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  opacity: 0;
  animation: sutraScrollIn 1s 1.8s ease-out forwards;
  position: relative;
}

.sutra-scroll::before,
.sutra-scroll::after {
  content: '';
  position: absolute;
  top: 0;
  width: 60px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.sutra-scroll::before {
  left: 0;
  background: linear-gradient(to right, rgba(26, 5, 5, 0.9), transparent);
}

.sutra-scroll::after {
  right: 0;
  background: linear-gradient(to left, rgba(26, 5, 5, 0.9), transparent);
}

@keyframes sutraScrollIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sutra-track {
  display: flex;
  gap: 48px;
  white-space: nowrap;
  animation: sutraFlow 40s linear infinite;
}

@keyframes sutraFlow {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.sutra-text {
  font-family: var(--font-accent);
  font-size: clamp(12px, 1.4vw, 14px);
  color: var(--gold-primary);
  letter-spacing: 0.15em;
  opacity: 0.35;
  flex-shrink: 0;
}

.sutra-text::before {
  content: '☸ ';
  opacity: 0.5;
}

.sutra-text::after {
  content: ' ☸';
  opacity: 0.5;
}

/* ===== Footer Symbols ===== */
.footer-symbols {
  display: flex;
  align-items: center;
  gap: 20px;
  font-family: var(--font-title);
  font-size: 14px;
  color: var(--gold-primary);
  opacity: 0.3;
  letter-spacing: 0.2em;
}
</style>
