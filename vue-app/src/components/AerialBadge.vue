<template>
  <div
    v-if="show"
    class="aerial-badge"
    @click="$emit('click')"
    @mouseenter="onHover($event, true)"
    @mouseleave="onHover($event, false)"
  >
    <span style="font-size:20px;">📍</span>
    <span style="font-weight:600;font-size:15px;">{{ label }}</span>
    <span style="color:rgba(255,255,255,0.5);font-size:18px;">↩</span>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  label: { type: String, default: '' }
});
defineEmits(['click']);

function onHover(e, hover) {
  const el = e.currentTarget;
  if (hover) {
    el.style.transform = 'scale(1.08)';
    el.style.borderColor = 'rgba(212,160,23,0.9)';
    el.style.boxShadow = '0 6px 24px rgba(212,160,23,0.25)';
  } else {
    el.style.transform = 'scale(1)';
    el.style.borderColor = 'rgba(212,160,23,0.5)';
    el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.6)';
  }
}
</script>

<style scoped>
.aerial-badge {
  display: flex;
  position: absolute;
  bottom: 140px;
  right: 14px;
  z-index: 3;
  background: linear-gradient(135deg, rgba(0,0,0,0.85), rgba(40,30,10,0.9));
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(212,160,23,0.5);
  box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  transition: all 0.2s;
}
</style>
