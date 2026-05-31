<template>
  <div class="fade" :class="{ active }"></div>
</template>

<script setup>
defineProps({ active: Boolean });
</script>

<style scoped>
.fade {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 2;
}
.fade.active { opacity: 1; }
</style>
