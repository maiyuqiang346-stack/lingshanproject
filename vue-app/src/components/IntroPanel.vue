<template>
  <div v-if="show" class="intro-panel">
    <LingshanTextbox :title="title" :content="content" />
  </div>
</template>

<script setup>
import LingshanTextbox from './LingshanTextbox.vue';

defineProps({
  show: Boolean,
  title: { type: String, default: '' },
  content: { type: String, default: '' }
});
</script>

<style scoped>
.intro-panel {
  position: absolute;
  bottom: 130px;
  left: 90px;
  z-index: 50;
  max-width: 380px;
}
</style>
