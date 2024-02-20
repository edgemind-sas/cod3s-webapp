<template>
  <!-- Conteneur principal défini pour prendre toute la hauteur disponible -->
  <div style="height: 100%;">
    <!-- Intégration du composant GoJS personnalisé -->
    <component_gojs></component_gojs>
  </div> 
</template>

<script lang="ts">
// Importations nécessaires depuis Vue et le composant enfant component_gojs.vue
import { defineComponent, onMounted } from 'vue';
import component_gojs from '@/components/component_gojs.vue';

export default defineComponent({
  // Déclaration des composants enfants utilisés dans ce composant
  components: { component_gojs },

  setup() {
    // Hook onMounted exécuté après que le composant soit monté dans le DOM
    // Actuellement, le corps de cette fonction est vide, indiquant qu'aucune action n'est effectuée au montage
    onMounted(async () => {
      // Actions potentielles à exécuter après le montage du composant
    });

    // Rien n'est retourné de setup(), indiquant qu'aucune propriété ou méthode réactive n'est utilisée
    return {  };
  },
});
</script>
