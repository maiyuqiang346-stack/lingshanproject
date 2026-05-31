<template>
  <div ref="elRef" class="coord-display" title="点击复制坐标"></div>
</template>

<script setup>
import { ref } from 'vue'

const elRef = ref(null)

defineExpose({ el: elRef })
</script>

<style scoped>
.coord-display {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 6;
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(212, 160, 23, 0.4);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: #d4a017;
  cursor: pointer;
  user-select: none;
}
</style>
