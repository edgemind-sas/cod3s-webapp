<template>
  <v-app style="height: 100%">

    <v-app-bar color="#c9d4e6ff" dense>
      <v-toolbar-title class="d-flex align-center">
        <v-img src="@/assets/logos/logo.png" height="30" contain></v-img>
        <span class="brand-text">COD3S</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="main-content">
      <v-container fluid class="fill-height">
        <v-row class="fill-height d-flex flex-nowrap">
          <v-col cols="2" class="sidebar-left">

            <v-list-subheader class="system-name">{{ systemName }}</v-list-subheader>

            <v-list class="navigation" dense>
              
              <v-list-item
                link to="/modelisation"
                class="navigation-link">
              <v-list-item-title>System</v-list-item-title>
              </v-list-item>

              <v-list-item
              to="/simulation"
                @click="showSimulationComponent = true"
                class="navigation-link">
                <v-list-item-title>Interactive simulation</v-list-item-title>
              </v-list-item>
              
            </v-list>
          </v-col>

          
        <v-col :style="{ flex: '1 1 auto' }">
        <router-view></router-view>
        </v-col>

        <v-col :style="{ flex: '0 0 ' + sidebarWidth + 'px' }" class="sidebar-right">

          <div class="resize-bar" @mousedown="startResize"></div>
    
          <component_simulation_interactive v-if="showSimulationComponent"></component_simulation_interactive>

        </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import modelService from "@/service/modelService";
import component_simulation_interactive from "@/components/component_simulation_interactive.vue"; 

export default defineComponent({
  components : { component_simulation_interactive },
  setup() {
    const systemName = ref(null);
    const showSimulationComponent = ref(false);
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
      systemName.value = await modelService.fetchSystemName();
    });

    watch(() => route.path, (newPath) =>{
      if (newPath !== '/simulation') {
        showSimulationComponent.value = false;
      }
    }, { immediate: true });

    return { systemName, showSimulationComponent, sidebarWidth,
      startResize, mainColWidth };
  },
})
</script>

<style>

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
