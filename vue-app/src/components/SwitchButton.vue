<template>
  <div v-if="show" class="switch-btn" @click="$emit('click')">
    <div class="switch-circle"
      @mouseenter="$event.currentTarget.style.background='rgba(255,255,255,0.15)'; $event.currentTarget.style.transform='scale(1.08)'"
      @mouseleave="$event.currentTarget.style.background='rgba(0,0,0,0.55)'; $event.currentTarget.style.transform='scale(1)'"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff2b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="icon === 'moon'" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        <template v-else>
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </template>
      </svg>
    </div>
    <span class="switch-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  label: { type: String, default: '' },
  icon: { type: String, default: 'moon' } // 'moon' or 'sun'
});
defineEmits(['click']);
</script>

<style scoped>
.switch-btn {
  position: absolute;
  bottom: 190px;
  right: 20px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.switch-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  border: 1.5px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
.switch-label {
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  font-weight: 500;
}
</style>
