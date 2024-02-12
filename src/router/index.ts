// Composables
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/modelisation',
      name: 'modelisation',
      component: () => import('../views/modelisation.vue')
    }, 
    {
      path: '/simulation',
      name: 'simulation',
      component: () => import('../views/simulation.vue')
    }, 
    {
      path: '/SimulationInteractive',
      name: 'SimulationInteractive',
      component: () => import('../views/SimulationInteractive.vue')
    }, 
     {
      path: '/gojs/:path',
      name: 'ComponentGojs',
      component: () => import('../components/component_gojs.vue'),
      props: true  
    },
  ]
})


export default router
