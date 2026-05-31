<template>
  <div v-if="show" class="label-panel">
    <div class="panel-title">{{ title }}</div>
    <div class="panel-scenes">
      <div
        v-if="!scenes || scenes.length === 0"
        class="no-scenes"
      >暂无关联场景</div>
      <div
        v-for="(scene, i) in scenes"
        :key="i"
        class="scene-item"
        @click="$emit('jump', scene.index, scene.names)"
        @mouseenter="$event.currentTarget.style.background='rgba(212,160,23,0.15)'; $event.currentTarget.style.borderColor='rgba(212,160,23,0.3)'"
        @mouseleave="$event.currentTarget.style.background='rgba(255,255,255,0.06)'; $event.currentTarget.style.borderColor='rgba(255,255,255,0.08)'"
      >
        <span class="scene-num">{{ i + 1 }}</span>
        <span>{{ scene.name }}</span>
      </div>
    </div>
    <div class="panel-footer">
      <button class="close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: '' },
  scenes: { type: Array, default: () => [] }
});
defineEmits(['jump', 'close']);
</script>

<style scoped>
.label-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background: rgba(0,0,0,0.85);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 16px 20px;
  min-width: 200px;
  max-width: 320px;
}
.panel-title {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 500;
}
.no-scenes {
  color: rgba(255,255,255,0.4);
  font-size: 12px;
}
.scene-item {
  margin: 4px 0;
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255,255,255,0.08);
}
.scene-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #d4a017, #a67010);
  border-radius: 50%;
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.panel-footer {
  margin-top: 10px;
  text-align: right;
}
.close-btn {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
}
</style>
