<template>
  <div ref="stripRef" class="strip">
    <!-- History items -->
    <div
      v-for="(item, i) in historyItems"
      :key="'hist-' + i"
      class="th"
      style="opacity: 0.85"
      @click="$emit('selectHistory', i)"
    >
      <img :src="item.t" loading="lazy" :alt="item.n" style="border: 2px solid rgba(212,160,23,0.5)">
      <span style="color: #d4a017; font-size: 10px">{{ item.n }}</span>
    </div>

    <!-- Current items -->
    <div
      v-for="(item, i) in items"
      :key="'cur-' + i"
      class="th"
      :class="{ active: activeIndex === item.index }"
      @click="$emit('select', item.index)"
    >
      <img :src="item.t" loading="lazy" :alt="item.n">
      <span>{{ item.n }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({
  items: { type: Array, default: () => [] },
  activeIndex: { type: Number, default: -1 },
  historyItems: { type: Array, default: () => [] }
});

defineEmits(['select', 'selectHistory']);

const stripRef = ref(null);

function onWheel(e) {
  e.preventDefault();
  if (stripRef.value) {
    stripRef.value.scrollLeft += e.deltaY * 2;
  }
}

onMounted(() => {
  if (stripRef.value) {
    stripRef.value.addEventListener('wheel', onWheel, { passive: false });
  }
});

onBeforeUnmount(() => {
  if (stripRef.value) {
    stripRef.value.removeEventListener('wheel', onWheel);
  }
});
</script>

<style scoped>
.strip {
  height: 110px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(10, 10, 10, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  -webkit-overflow-scrolling: touch;
}
.strip::-webkit-scrollbar { height: 4px; }
.strip::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 2px; }
.strip::-webkit-scrollbar-track { background: transparent; }

.th {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.th img {
  width: 140px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid transparent;
  transition: border-color 0.25s, box-shadow 0.25s;
  pointer-events: none;
}
.th span {
  font-size: 11px;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  pointer-events: none;
  transition: color 0.25s;
}
.th:hover {
  transform: scale(1.15);
  z-index: 2;
}
.th:hover img {
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
}
.th:hover span { color: #fff; }
.th.active img {
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}
.th.active span { color: #fff; }
</style>
