<template>
  <div class="survey">
    <!-- ===== Background & Atmosphere (absolute, non-interactive) ===== -->
    <div class="bg-base"></div>
    <div class="bg-vignette"></div>
    <div class="bg-mist"></div>

    <div class="bg-photo bg-photo-left"></div>
    <div class="bg-photo bg-photo-center"></div>
    <div class="bg-photo bg-photo-right"></div>

    <!-- 卍 Watermark -->
    <div class="wan-watermark">卍</div>

    <!-- Dharma Wheel -->
    <div class="dharma-wheel-bg">
      <div class="dharma-wheel-glow"></div>
      <svg viewBox="0 0 200 200" class="dharma-wheel-svg">
        <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(212,168,67,0.1)" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(212,168,67,0.08)" stroke-width="1"/>
        <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(212,168,67,0.06)" stroke-width="1"/>
        <circle cx="100" cy="100" r="14" fill="none" stroke="rgba(212,168,67,0.12)" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="6" fill="rgba(212,168,67,0.1)"/>
        <line v-for="i in 8" :key="'spoke-'+i" :x1="100 + 16 * Math.cos((i-1)*Math.PI/4)" :y1="100 + 16 * Math.sin((i-1)*Math.PI/4)" :x2="100 + 92 * Math.cos((i-1)*Math.PI/4)" :y2="100 + 92 * Math.sin((i-1)*Math.PI/4)" stroke="rgba(212,168,67,0.08)" stroke-width="1.5"/>
        <circle v-for="i in 8" :key="'node-'+i" :cx="100 + 75 * Math.cos((i-1)*Math.PI/4)" :cy="100 + 75 * Math.sin((i-1)*Math.PI/4)" r="3" fill="rgba(212,168,67,0.08)"/>
      </svg>
    </div>

    <!-- Incense smoke -->
    <div class="incense-smoke">
      <div class="smoke-wisp smoke-wisp-1"></div>
      <div class="smoke-wisp smoke-wisp-2"></div>
      <div class="smoke-wisp smoke-wisp-3"></div>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      <div v-for="p in particles" :key="p.id" class="particle" :style="p.style"></div>
    </div>

    <!-- Light rays -->
    <div class="buddha-light">
      <div class="light-ray" v-for="i in 8" :key="'ray-'+i" :style="{ '--angle': `${(i-1) * 45}deg`, '--delay': `${i * 0.4}s` }"></div>
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

    <!-- Wisdom quotes (absolute decorative, outside content flow) -->
    <div class="wisdom-deco">
      <div class="prayer-beads">
        <svg viewBox="0 0 120 120" class="beads-svg">
          <circle v-for="i in 18" :key="'bead-'+i"
            :cx="60 + 48 * Math.cos((i-1) * 2 * Math.PI / 18 - Math.PI/2)"
            :cy="60 + 48 * Math.sin((i-1) * 2 * Math.PI / 18 - Math.PI/2)"
            r="5" fill="none" stroke="var(--gold-primary)" stroke-width="0.8" :opacity="0.12 + (i === 1 ? 0.2 : 0)"/>
          <circle v-for="i in 18" :key="'bead-fill-'+i"
            :cx="60 + 48 * Math.cos((i-1) * 2 * Math.PI / 18 - Math.PI/2)"
            :cy="60 + 48 * Math.sin((i-1) * 2 * Math.PI / 18 - Math.PI/2)"
            r="2.5" :fill="i === 1 ? 'var(--gold-primary)' : 'rgba(212,168,67,0.1)'" :opacity="i === 1 ? 0.4 : 0.25"/>
          <circle cx="60" cy="60" r="12" fill="none" stroke="var(--gold-primary)" stroke-width="0.6" opacity="0.2"/>
          <text x="60" y="64" text-anchor="middle" fill="var(--gold-primary)" font-size="12" opacity="0.25" font-family="serif">佛</text>
        </svg>
      </div>
      <div class="wisdom-quotes">
        <p v-for="(q, i) in wisdomQuotes" :key="i" class="wisdom-line">
          <span class="wisdom-bracket">{{ q.bracket }}</span>
          <span class="wisdom-text">{{ q.text }}</span>
        </p>
      </div>
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

    <!-- Sutra scroll at bottom -->
    <div class="sutra-scroll">
      <div class="sutra-track">
        <span class="sutra-text" v-for="(sutra, i) in [...sutraList, ...sutraList]" :key="i">{{ sutra }}</span>
      </div>
    </div>

    <!-- ===== Main Content (unaffected by decorations) ===== -->
    <div class="content">
      <header class="survey-header">
        <div class="header-deco">
          <span class="deco-line"></span>
          <span class="deco-symbol">☸</span>
          <span class="deco-lotus">❀</span>
          <span class="deco-symbol">☸</span>
          <span class="deco-line"></span>
        </div>

        <p class="subtitle">佛光普照 · 灵山胜境</p>
        <h1 class="survey-title">灵山胜境</h1>
        <p class="mantra-line">唵嘛呢叭咪吽</p>
        <p class="survey-desc">请选择您想体验的游览线路，开启专属之旅</p>

        <div class="header-deco">
          <span class="deco-line"></span>
          <span class="deco-symbol">☸</span>
          <span class="deco-lotus">❀</span>
          <span class="deco-symbol">☸</span>
          <span class="deco-line"></span>
        </div>
      </header>

      <section class="section">
        <div class="pref-options">
          <button
            v-for="pref in preferences"
            :key="pref.value"
            class="pref-card"
            :class="{ selected: selectedPref === pref.value }"
            @click="selectedPref = pref.value"
          >
            <span class="pref-icon">{{ pref.icon }}</span>
            <div class="pref-text">
              <span class="pref-label">{{ pref.label }}</span>
              <span class="pref-desc">{{ pref.desc }}</span>
            </div>
            <span class="pref-check">
              <svg viewBox="0 0 20 20" width="18" height="18">
                <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <circle v-if="selectedPref === pref.value" cx="10" cy="10" r="5" fill="currentColor"/>
              </svg>
            </span>
          </button>
        </div>
      </section>

      <!-- Cloud divider -->
      <div class="cloud-divider">
        <svg viewBox="0 0 400 30" class="cloud-svg">
          <path d="M0,15 Q50,5 100,15 Q150,25 200,15 Q250,5 300,15 Q350,25 400,15" fill="none" stroke="var(--gold-primary)" stroke-width="0.8" opacity="0.2"/>
        </svg>
      </div>

      <button class="enter-btn" :disabled="!canEnter" @click="enterSite">
        <span>进入灵山胜境</span>
        <svg class="btn-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <footer class="footer">
        <p class="footer-text">灵山胜境景区 · 数字化体验平台</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedPref = ref(null)
const canEnter = computed(() => !!selectedPref.value)

const preferences = [
  { value: 'culture', label: '了解佛教文化', desc: '深入探索灵山佛教文化、历史典故与禅意之美'},
  { value: 'play', label: '游览路线推荐', desc: '了解景区哪里好玩、最佳游览路线与精彩项目'},
  { value: 'both', label: '文化 + 游玩 + 打卡', desc: '融合文化体验、游览路线与拍照打卡点的综合推荐'},
]

const wisdomQuotes = [
  { bracket: '『', text: '心经云：照见五蕴皆空，度一切苦厄' },
  { bracket: '『', text: '六祖云：菩提本无树，明镜亦非台' },
  { bracket: '『', text: '金刚云：凡所有相，皆是虚妄' },
]

const sutraList = ['色即是空，空即是色', '照见五蕴皆空，度一切苦厄', '一花一世界，一叶一菩提', '凡所有相，皆是虚妄', '南无阿弥陀佛']

const particles = reactive([])

function generateParticles(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      id: `sp-${i}`,
      style: {
        '--px': `${Math.random() * 100}%`,
        '--py': `${Math.random() * 100}%`,
        '--size': `${1 + Math.random() * 2.5}px`,
        '--duration': `${10 + Math.random() * 14}s`,
        '--delay': `${Math.random() * 8}s`,
        '--drift': `${-20 + Math.random() * 40}px`,
        '--opacity': `${0.15 + Math.random() * 0.35}`,
      },
    })
  }
}

function enterSite() {
  if (!canEnter.value) return
  router.push('/home')
}

onMounted(() => {
  generateParticles(60)
})
</script>

<style scoped>
.survey {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ===== Backgrounds ===== */
.bg-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 80% at 50% 30%, #6b1a1a 0%, #3a0d0d 40%, #1a0505 80%, #0a0202 100%);
  z-index: 0;
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%);
  z-index: 1;
  pointer-events: none;
}

.bg-mist {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 60% 30% at 50% 20%, rgba(212,168,67,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 25% at 20% 80%, rgba(212,168,67,0.04) 0%, transparent 60%);
  animation: mistDrift 20s ease-in-out infinite alternate;
}

@keyframes mistDrift {
  0% { transform: translateX(-1%); }
  100% { transform: translateX(1%); }
}

.bg-photo {
  position: absolute;
  background-size: cover;
  background-position: center;
  z-index: 0;
  opacity: 0.65;
  filter: saturate(0.9) brightness(1.15);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.bg-photo-left {
  width: 28%;
  height: 40%;
  left: 0;
  bottom: 5%;
  background-image: url('/images/scene1.png');
  mask-image: radial-gradient(ellipse 100% 100% at 30% 60%, black 15%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 30% 60%, black 15%, transparent 75%);
}

.bg-photo-center {
  width: 35%;
  height: 35%;
  left: 50%;
  top: 55%;
  transform: translateX(-50%);
  background-image: url('/images/scene3.png');
  mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 75%);
}

.bg-photo-right {
  width: 28%;
  height: 40%;
  right: 0;
  top: 10%;
  background-image: url('/images/scene2.png');
  mask-image: radial-gradient(ellipse 100% 100% at 70% 40%, black 15%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 100% 100% at 70% 40%, black 15%, transparent 75%);
}

/* ===== Watermark ===== */
.wan-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(280px, 42vw, 520px);
  color: rgba(212, 168, 67, 0.035);
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

/* ===== Dharma Wheel ===== */
.dharma-wheel-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(460px, 62vw, 720px);
  height: clamp(460px, 62vw, 720px);
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  animation: wheelRotate 120s linear infinite;
}

.dharma-wheel-glow {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,168,67,0.08) 0%, rgba(212,168,67,0.03) 40%, transparent 70%);
  animation: glowPulse 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.dharma-wheel-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(212,168,67,0.15)) drop-shadow(0 0 60px rgba(212,168,67,0.08));
}

@keyframes wheelRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ===== Incense Smoke ===== */
.incense-smoke {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
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
  left: 30%;
  width: 40px;
  height: 120%;
  background: linear-gradient(to top, rgba(212,168,67,0.07), rgba(212,168,67,0.02), transparent);
  filter: blur(25px);
  animation: smokeRise 12s 0s ease-in-out infinite;
}

.smoke-wisp-2 {
  left: 55%;
  width: 30px;
  height: 120%;
  background: linear-gradient(to top, rgba(212,168,67,0.05), rgba(212,168,67,0.01), transparent);
  filter: blur(30px);
  animation: smokeRise 16s 4s ease-in-out infinite;
}

.smoke-wisp-3 {
  left: 75%;
  width: 35px;
  height: 120%;
  background: linear-gradient(to top, rgba(232,180,184,0.04), rgba(232,180,184,0.01), transparent);
  filter: blur(28px);
  animation: smokeRise 14s 8s ease-in-out infinite;
}

@keyframes smokeRise {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  15% { opacity: 0.4; }
  50% { transform: translateY(-30%) scaleX(2.5); opacity: 0.25; }
  85% { opacity: 0.08; }
  100% { transform: translateY(-60%) scaleX(4); opacity: 0; }
}

/* ===== Particles ===== */
.particles {
  position: absolute;
  inset: 0;
  z-index: 2;
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
  box-shadow: 0 0 4px var(--shadow-gold);
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) translateX(0); opacity: var(--opacity); }
  50% { transform: translateY(-40px) translateX(var(--drift)); opacity: calc(var(--opacity) * 1.3); }
}

/* ===== Light Rays ===== */
.buddha-light {
  position: absolute;
  top: 0;
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
  width: 1.5px;
  height: clamp(180px, 28vh, 350px);
  background: linear-gradient(to bottom, rgba(212,168,67,0.1), rgba(212,168,67,0.02), transparent);
  transform-origin: top center;
  transform: rotate(var(--angle));
  opacity: 0;
  animation: rayPulse 5s var(--delay) ease-in-out infinite;
}

@keyframes rayPulse {
  0%, 100% { opacity: 0; }
  40% { opacity: 0.5; }
  70% { opacity: 0.2; }
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

/* ===== Wisdom Deco (absolute, outside content flow) ===== */
.wisdom-deco {
  position: absolute;
  left: clamp(60px, 7vw, 100px);
  bottom: clamp(50px, 8vh, 100px);
  z-index: 3;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0.5;
}

.prayer-beads {
  width: clamp(48px, 5vw, 64px);
  height: clamp(48px, 5vw, 64px);
  animation: beadsSpin 60s linear infinite;
  flex-shrink: 0;
}

@keyframes beadsSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.beads-svg {
  width: 100%;
  height: 100%;
}

.wisdom-quotes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wisdom-line {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.wisdom-bracket {
  font-family: serif;
  font-size: clamp(11px, 1.2vw, 13px);
  color: var(--gold-primary);
  opacity: 0.4;
}

.wisdom-text {
  font-family: var(--font-accent);
  font-size: clamp(11px, 1.2vw, 13px);
  color: var(--cream-dim);
  letter-spacing: 0.08em;
  opacity: 0.55;
}

/* ===== Sutra Scroll ===== */
.sutra-scroll {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(280px, 50vw, 500px);
  overflow: hidden;
  z-index: 4;
  pointer-events: none;
  opacity: 0.6;
}

.sutra-scroll::before, .sutra-scroll::after {
  content: '';
  position: absolute;
  top: 0;
  width: 40px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.sutra-scroll::before {
  left: 0;
  background: linear-gradient(to right, rgba(10, 2, 2, 0.9), transparent);
}

.sutra-scroll::after {
  right: 0;
  background: linear-gradient(to left, rgba(10, 2, 2, 0.9), transparent);
}

.sutra-track {
  display: flex;
  gap: 32px;
  white-space: nowrap;
  animation: sutraFlow 35s linear infinite;
}

@keyframes sutraFlow {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.sutra-text {
  font-family: var(--font-accent);
  font-size: clamp(10px, 1vw, 12px);
  color: var(--gold-primary);
  letter-spacing: 0.12em;
  opacity: 0.25;
  flex-shrink: 0;
}

.sutra-text::before { content: '☸ '; opacity: 0.4; }
.sutra-text::after { content: ' ☸'; opacity: 0.4; }

/* ===== Content (centered, unaffected by decorations) ===== */
.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: clamp(65px, 12vh, 130px) clamp(130px, 17vw, 320px) clamp(35px, 7vh, 90px);
  gap: 28px;
  animation: contentIn 0.8s ease-out;
}

@keyframes contentIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Header ===== */
.survey-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.header-deco {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.4;
}

.deco-line {
  display: block;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
}

.deco-lotus {
  font-size: 12px;
  color: var(--gold-primary);
}

.deco-symbol {
  font-size: 10px;
  color: var(--gold-primary);
  opacity: 0.5;
}

.subtitle {
  font-family: var(--font-accent);
  font-size: clamp(12px, 1.4vw, 14px);
  color: var(--gold-primary);
  letter-spacing: 0.4em;
  opacity: 0.7;
}

.survey-title {
  font-family: var(--font-title);
  font-size: clamp(56px, 10vw, 96px);
  font-weight: 400;
  color: var(--cream);
  letter-spacing: 0.15em;
  line-height: 1.1;
  text-shadow:
    0 0 30px rgba(212,168,67,0.6),
    0 0 60px rgba(212,168,67,0.4),
    0 0 120px rgba(212,168,67,0.2),
    0 2px 4px rgba(0,0,0,0.5);
  position: relative;
}

.survey-title::before {
  content: '';
  position: absolute;
  inset: -20%;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
  animation: titleGlow 4s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.mantra-line {
  font-family: var(--font-accent);
  font-size: clamp(14px, 2.2vw, 20px);
  color: var(--gold-primary);
  letter-spacing: 0.5em;
  opacity: 0.5;
}

.survey-desc {
  font-family: var(--font-body);
  font-size: clamp(13px, 1.6vw, 15px);
  color: var(--cream-dim);
  letter-spacing: 0.1em;
  opacity: 0.75;
  margin-top: 4px;
}

/* ===== Section ===== */
.section {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  animation: fadeUp 0.6s 0.3s ease-out forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.pref-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.pref-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(50, 12, 12, 0.6);
  border: 1px solid rgba(212,168,67,0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  text-align: left;
  color: var(--cream);
  backdrop-filter: blur(4px);
}

.pref-card:hover {
  border-color: rgba(212,168,67,0.35);
  background: rgba(70, 18, 18, 0.7);
  transform: translateY(-1px);
}

.pref-card:focus-visible {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 2px rgba(212,168,67,0.3);
}

.pref-card.selected {
  border-color: var(--gold-primary);
  background: rgba(212,168,67,0.1);
  box-shadow: 0 0 24px rgba(212,168,67,0.08);
}

.pref-icon {
  font-size: 26px;
  flex-shrink: 0;
  width: 36px;
  text-align: center;
}

.pref-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pref-label {
  font-family: var(--font-title);
  font-size: clamp(17px, 2.2vw, 20px);
  color: var(--gold-light);
  letter-spacing: 0.08em;
}

.pref-card.selected .pref-label {
  color: var(--gold-bright);
}

.pref-desc {
  font-family: var(--font-body);
  font-size: clamp(12px, 1.4vw, 13px);
  color: var(--cream-dim);
  line-height: 1.5;
  letter-spacing: 0.03em;
  opacity: 0.65;
}

.pref-card.selected .pref-desc {
  opacity: 0.9;
  color: var(--cream);
}

.pref-check {
  flex-shrink: 0;
  color: var(--gold-primary);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.pref-card.selected .pref-check {
  opacity: 1;
}

/* ===== Cloud Divider ===== */
.cloud-divider {
  width: 200px;
  height: 16px;
  opacity: 0;
  animation: fadeUp 0.6s 0.45s ease-out forwards;
}

.cloud-svg {
  width: 100%;
  height: 100%;
}

/* ===== Enter Button ===== */
.enter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  padding: 16px 32px;
  border: 1.5px solid var(--gold-primary);
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(212,168,67,0.18), rgba(212,168,67,0.06));
  color: var(--gold-bright);
  font-family: var(--font-title);
  font-size: clamp(18px, 2.5vw, 22px);
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.35s ease;
  outline: none;
  opacity: 0;
  animation: fadeUp 0.6s 0.5s ease-out forwards;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.enter-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(212,168,67,0.28), rgba(212,168,67,0.12));
  box-shadow: 0 0 40px rgba(212,168,67,0.18);
  transform: translateY(-2px);
}

.enter-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}

.enter-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(212,168,67,0.4);
}

.enter-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  border-color: rgba(212,168,67,0.2);
  box-shadow: none;
}

/* ===== Footer ===== */
.footer {
  opacity: 0;
  animation: fadeUp 0.6s 0.7s ease-out forwards;
}

.footer-text {
  font-family: var(--font-accent);
  font-size: 12px;
  color: var(--cream-dim);
  letter-spacing: 0.2em;
  opacity: 0.4;
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .content {
    padding: clamp(80px, 12vh, 130px) clamp(60px, 10vw, 160px) clamp(60px, 7vh, 90px);
    gap: 16px;
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

  .wisdom-deco { display: none; }
}

@media (max-width: 600px) {
  .content {
    gap: 14px;
    padding: clamp(80px, 12vh, 130px) 20px clamp(60px, 7vh, 90px);
  }

  .pref-card {
    padding: 14px 16px;
    gap: 12px;
  }

  .frame-left, .frame-right {
    width: 24px;
  }

  .pillar-symbols { display: none; }
  .pillar-edge-line { display: none; }
  .pillar-vline { display: none; }
  .corner-ornament { display: none; }
}

@media (max-width: 400px) {
  .frame-left, .frame-right {
    display: none;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .particle, .bg-mist, .light-ray, .dharma-wheel-bg, .smoke-wisp, .prayer-beads, .wan-watermark, .pillar-symbols span, .sutra-track {
    animation: none !important;
  }

  .content, .section, .enter-btn, .footer, .cloud-divider {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
