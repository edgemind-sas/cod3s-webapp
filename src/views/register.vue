<template>
  <v-card class="mx-auto" max-width="344" title="User Registration">
    <v-container>
      <!-- Champs de saisie pour l'enregistrement -->
      <v-text-field v-model="first" label="First name" variant="underlined"></v-text-field>
      <v-text-field v-model="last" label="Last name" variant="underlined"></v-text-field>
      <v-text-field v-model="email" label="Email" variant="underlined"></v-text-field>
      <v-text-field v-model="password" label="Password" placeholder="Enter your password" variant="underlined"></v-text-field>
      <v-combobox label="Role" v-model="role" :items="['admin', 'user']"></v-combobox>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="handleRegister" color="success">
        Complete Registration
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import modelService from '@/service/modelService';

// Références réactives pour les champs de saisie
const first = ref('');
const last = ref('');
const email = ref('');
const password = ref('');
const role = ref('user');

const router = useRouter();

// Fonction pour gérer l'inscription
const handleRegister = async () => {
  try {
    const roles = [role.value];
    await modelService.register(first.value, last.value, email.value, password.value, roles);
    alert('Registration successful');
    router.push('/');
  } catch (error) {
    console.error('Registration failed:', (error as Error).message);
    alert('Registration failed: ' + (error as Error).message);
  }
};
</script>

