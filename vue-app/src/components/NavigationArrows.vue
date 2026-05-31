<template>
  <div v-if="show" class="nav-arrows">
    <div class="side-arrow left" @click="$emit('back')"
      @mouseenter="onHover($event, true)"
      @mouseleave="onHover($event, false)"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4a017" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      <div class="arrow-label">返</div>
    </div>

    <div class="side-arrow right" @click="$emit('back')"
      @mouseenter="onHover($event, true)"
      @mouseleave="onHover($event, false)"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d4a017" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      <div class="arrow-label">返</div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(['back']);

function onHover(e, hover) {
  const el = e.currentTarget;
  if (hover) {
    el.style.background = 'rgba(40,20,0,0.85)';
    el.style.boxShadow = '0 0 28px rgba(212,160,23,0.5), inset 0 0 16px rgba(212,160,23,0.15)';
  } else {
    el.style.background = 'rgba(20,10,0,0.65)';
    el.style.boxShadow = '0 0 18px rgba(212,160,23,0.25), inset 0 0 12px rgba(212,160,23,0.08)';
  }
}
</script>

<style scoped>
.nav-arrows {
  pointer-events: none;
}
.side-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 25;
  cursor: pointer;
  padding: 28px 14px;
  background: rgba(20, 10, 0, 0.65);
  border: 1.5px solid rgba(212, 160, 23, 0.5);
  border-radius: 0 12px 12px 0;
  box-shadow: 0 0 18px rgba(212, 160, 23, 0.25), inset 0 0 12px rgba(212, 160, 23, 0.08);
  transition: all 0.25s;
  pointer-events: auto;
}
.side-arrow.left {
  left: 0;
  border-left: none;
  border-radius: 0 12px 12px 0;
}
.side-arrow.right {
  right: 0;
  border-right: none;
  border-radius: 12px 0 0 12px;
}
.arrow-label {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: rgba(212, 160, 23, 0.7);
  letter-spacing: 1px;
}
</style>
