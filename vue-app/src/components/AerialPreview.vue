<template>
  <div v-if="show" class="aerial-preview" @click="$emit('click')">
    <img class="preview-img" :src="imgSrc" alt="preview">
    <div v-if="showHint" class="preview-hint">点击进入全景</div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  imgSrc: { type: String, default: '' },
  showHint: { type: Boolean, default: true }
});
defineEmits(['click']);
</script>

<style scoped>
.aerial-preview {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: #000;
  cursor: pointer;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  padding: 10px 24px;
  border-radius: 20px;
  border: 1px solid rgba(212,160,23,0.4);
  font-size: 14px;
  color: #fff;
  pointer-events: none;
}
</style>
