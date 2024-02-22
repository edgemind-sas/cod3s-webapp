<template>
  <!-- Crée une ligne avec Vuetify qui remplit la hauteur disponible et empêche le wrap des éléments (flex-nowrap) -->
  <v-row class="fill-height d-flex flex-nowrap">

    <!-- Colonne principale qui s'adapte automatiquement à l'espace disponible grâce à la propriété flex -->
    <v-col :style="{ flex: '1 1 auto' }">
      <!-- Composant personnalisé pour GoJS, probablement pour afficher des graphiques ou des diagrammes -->
      <component_gojs></component_gojs>
    </v-col>

    <!-- Colonne de la barre latérale avec une largeur fixe déterminée par la variable sidebarWidth -->
    <v-col :style="{ flex: '0 0 ' + sidebarWidth + 'px' }" class="sidebar-right">

      <!-- Div servant de barre de redimensionnement. Le redimensionnement commence lorsqu'on maintient le clic sur cette barre. -->
      <div class="resize-bar" @mousedown="startResize"></div>

      <!-- Composant personnalisé pour une interface de simulation interactive -->
      <component_simulation_interactive></component_simulation_interactive>

    </v-col>
  </v-row>
</template>

  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import modelService from '@/service/modelService';
  import { useRoute } from 'vue-router';
  import component_gojs from '@/components/component_gojs.vue';
  import component_simulation_interactive from '@/components/component_simulation_interactive.vue'
  
  
  export default defineComponent({
    components: { component_simulation_interactive,component_gojs },
  
    setup() {
    
    const route = useRoute();
    const sidebarWidth = ref(300);
    const mainColWidth = ref(700);

    const startResize = (event: MouseEvent) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth.value; 
    const startWidthMainCol = mainColWidth.value;

    const doResize = async (moveEvent: MouseEvent) => {
    const diffX = moveEvent.clientX - startX;
    const newSidebarWidth = Math.max(startWidth - diffX, 50);
    const newMainColWidth = Math.max(window.innerWidth - newSidebarWidth - (startWidthMainCol - startWidth), 100);

    sidebarWidth.value = newSidebarWidth;
    mainColWidth.value = newMainColWidth;
  };

    const stopResize = async () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
       await modelService.updateFrontConfig({ is_panel_width: sidebarWidth.value })
          .catch(error => console.error("Erreur lors de la mise à jour de la configuration de la barre latérale:", error));
    };

      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    };

    const loadInitialSidebarConfig = async () => {
  try {
    const config = await modelService.getFrontConfig();
    // Accédez correctement à la configuration selon la structure de la réponse
    if (config.layout && config.layout.is_panel_width) {
      sidebarWidth.value = config.layout.is_panel_width;
      // Ajustez mainColWidth en fonction de la nouvelle sidebarWidth
      mainColWidth.value = window.innerWidth - sidebarWidth.value;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la configuration initiale de la barre latérale:", error);
  }
};

   
      
    
  
      onMounted(async () => {
        loadInitialSidebarConfig();
      });
  
      return {   
      sidebarWidth,
      startResize,
       mainColWidth };;
    },
  });
  </script>


<style scoped>
.sidebar-right {
  background-color: #c9d4e6ff; 
  position: relative;
  
}

.resize-bar {
  width: 10px; 
  height: 100%; 
  background-color: #ccc; 
  position: absolute; 
  left: 0; 
  top: 0; 
  cursor: ew-resize; 
}
</style>