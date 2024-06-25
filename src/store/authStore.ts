// src/store/authStore.ts
import { defineStore } from 'pinia';
import modelService from '@/service/modelService';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: localStorage.getItem('authToken') || '',
    user: {},
    isAuthenticated: false
  }),
  getters: {
    isUserAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(email: any, password: any) {
      try {
        const response = await modelService.login(email, password);
        if (response && response.access_token) {
          this.token = response.access_token;
          this.user = response.user;
          this.isAuthenticated = true;
          localStorage.setItem('authToken', this.token);
        } else {
          throw new Error('Authentication failed, no token received.');
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = {};
      this.isAuthenticated = false;
      localStorage.removeItem('authToken');
      //this.$router.push('/login');
    }
  }
});
