<template>
    <v-row class="fill-height d-flex flex-nowrap">
      <v-col :style="{ flex: '1 1 auto' }">
         <component_gojs> </component_gojs>
      </v-col>

      <v-col :style="{ flex: '0 0 ' + sidebarWidth + 'px' }" class="sidebar-right">

        <div class="resize-bar" @mousedown="startResize"></div>

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
.brand-text {
  color: #ef7b26;
  font-family: 'Open Sans', sans-serif;
  margin-left: 8px; 
}

html, body, #app, .v-application {
  height: 100%;
  margin: 0;
}

.v-toolbar-title {
  margin-left: -16px; 
}

.v-app-bar {
  box-shadow: none;
}

.main-content {
  height: calc(100% - 48px);
}

.main-content{
  margin-top: -27px;
}

.system-name {
  color: #ef7b26ff !important;
  font-family: 'Open Sans', sans-serif;
  background-color: transparent !important; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
 
}

.sidebar-left {
  background-color: #c9d4e6ff;
 
}

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

.navigation{
  background-color: #c9d4e6ff !important;
}

.main-content {
  height: calc(100% - 48px); 
  overflow-x: hidden; 
}

.v-col {
  display: flex;
  flex-direction: column;
  overflow: hidden; 
}

</style>