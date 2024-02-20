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
  import { useRoute } from 'vue-router';
  import component_gojs from '@/components/component_gojs.vue';
  import component_simulation_interactive from '@/components/component_simulation_interactive.vue'
  
  
  export default defineComponent({
    components: { component_simulation_interactive,component_gojs },
  
    setup() {
    
    const route = useRoute();
    const sidebarWidth = ref(100);
    const mainColWidth = ref(900);

    const startResize = (event: MouseEvent) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth.value; 
    const startWidthMainCol = mainColWidth.value;

    const doResize = (moveEvent: MouseEvent) => {
    const diffX = moveEvent.clientX - startX;
    const newSidebarWidth = Math.max(startWidth - diffX, 50);
    const newMainColWidth = Math.max(window.innerWidth - newSidebarWidth - (startWidthMainCol - startWidth), 100);

    sidebarWidth.value = newSidebarWidth;
    mainColWidth.value = newMainColWidth;
  };

    const stopResize = () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
    };

      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    };

   
      
    
  
      onMounted(async () => {
       
      });
  
      return {   sidebarWidth,
      startResize, mainColWidth };;
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