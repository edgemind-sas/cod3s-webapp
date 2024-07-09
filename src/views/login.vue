<template>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>
      <v-text-field
        v-model="email"  
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?
        </a>
      </div>

      <v-text-field
        v-model="password" 
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="toggleVisibility" 
      ></v-text-field>

      <v-btn
        @click="handleLogin" 
        color="blue"
        size="large"
        variant="tonal"
        block
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <router-link
          to="/register"
          class="text-blue text-decoration-none"
        >
          Sign up now <v-icon right>mdi-chevron-right</v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const email = ref<string>('');
const password = ref<string>('');
const visible = ref<boolean>(false);
const router = useRouter();
const authStore = useAuthStore();

const toggleVisibility = () => {
  visible.value = !visible.value;
};

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push('/modelisation'); 
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed: ' + (error as Error).message);
  }
};
</script>


