import { createRouter, createWebHashHistory } from 'vue-router';
import Survey from '../views/Survey.vue';
import Home from '../views/Home.vue';
import PanoramaView from '../views/PanoramaView.vue';
import AerialView from '../views/AerialView.vue';
import TextboxDemoView from '../views/TextboxDemoView.vue';
import Tour3D from '../views/Tour3D.vue';

const routes = [
  { path: '/', name: 'survey', component: Survey },
  { path: '/home', name: 'home', component: Home },
  { path: '/panorama', name: 'panorama', component: PanoramaView },
  { path: '/aerial', name: 'aerial', component: AerialView },
  { path: '/textbox', name: 'textbox', component: TextboxDemoView },
  { path: '/tour3d', name: 'tour3d', component: Tour3D },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
