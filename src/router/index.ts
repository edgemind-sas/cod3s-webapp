// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
    path: '/',
    name: 'Login', 
    component: () => import('../views/login.vue'), 
    //meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register.vue'),
    //meta: { requiresAuth: false }
  },
    {
      path: '/modelisation',
      name: 'modelisation',
      component: () => import('../views/modelisation.vue'), 
      meta: { requiresAuth: false }
    }, 
    {
      path: '/simulation',
      name: 'simulation',
      component: () => import('../views/simulation.vue'), 
      meta: { requiresAuth: false }
    }, 
    {
      path: '/SimulationInteractive',
      name: 'SimulationInteractive',
      component: () => import('../views/SimulationInteractive.vue'), 
      meta: { requiresAuth: false }
    }, 
     {
      path: '/gojs/:path',
      name: 'ComponentGojs',
      component: () => import('../components/component_gojs.vue'),
      props: true, 
      meta: { requiresAuth: true }
    },
  ]
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
