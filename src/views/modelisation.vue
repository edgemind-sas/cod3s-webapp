<template>
  <!-- Conteneur principal défini pour prendre toute la hauteur disponible -->
  <div style="height: 100%;">
    <!-- Intégration du composant GoJS personnalisé -->
    <component_gojs></component_gojs>
  </div> 
</template>

<script setup lang="ts">
// Importations nécessaires depuis Vue et le composant enfant component_gojs.vue
import { onMounted } from 'vue';
import component_gojs from '@/components/component_gojs.vue';

// Enregistre le composant enfant
onMounted(async () => {
  // Logique à exécuter lorsque le composant est monté
});

</script>

