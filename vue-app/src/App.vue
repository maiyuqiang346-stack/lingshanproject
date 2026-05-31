<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --temple-red: #7A1A1A;
  --temple-red-deep: #4A0E0E;
  --temple-red-dark: #2D0808;
  --gold-primary: #D4A843;
  --gold-light: #F0D68A;
  --gold-bright: #FFD700;
  --gold-glow: #FFE082;
  --cream: #FFF8E7;
  --cream-dim: #E8DCC8;
  --ivory: #FFFDF5;
  --lotus-pink: #E8B4B8;
  --incense: rgba(212, 168, 67, 0.15);
  --shadow-gold: rgba(212, 168, 67, 0.3);
  --font-title: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', serif;
  --font-body: 'Noto Serif SC', 'STSong', 'SimSun', serif;
  --font-accent: 'ZCOOL XiaoWei', 'STKaiti', serif;
}

html, body {
  height: 100%;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

#app { height: 100%; }

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: scale(1.02);
}
.page-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

::selection {
  background: var(--gold-primary);
  color: var(--temple-red-dark);
}
</style>
