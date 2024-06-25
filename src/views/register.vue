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

<script>
import modelService from "@/service/modelService";
import { useRouter } from 'vue-router';

export default {
  data: () => ({
    first: '',
    last: '',
    email: '',
    password: '',
    role: 'user'
  }),
  methods: {
    async handleRegister() {
      try {
        const roles = [this.role]; 
        await modelService.register(this.first, this.last, this.email, this.password, roles);
        alert('Registration successful');
        this.$router.push('/'); 
      } catch (error) {
        console.error('Registration failed:', error.message);
        alert('Registration failed: ' + error.message); 
      }
    }
  }
};
</script>
