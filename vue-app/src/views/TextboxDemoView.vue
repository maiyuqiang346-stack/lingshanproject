<template>
  <div class="textbox-demo">
    <div class="container">
      <LingshanTextbox title="大佛缘起" :content="demoContent" />
    </div>
  </div>
</template>

<script setup>
import LingshanTextbox from '../components/LingshanTextbox.vue';

const demoContent = `
<p>灵山胜境，位于太湖之滨，是一处集佛教文化、艺术、旅游于一体的圣地。</p>
<p>这里的大佛高88米，是中国第二高的巨型佛像，庄严肃穆，令人心生敬畏。</p>
`;
</script>

<style scoped>
.textbox-demo {
  font-family: 'Ma Shan Zheng', serif;
  background: #0c1208;
  color: #d4af37;
  padding: 60px 20px;
  line-height: 2;
  min-height: 100vh;
}
.container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
