<template>
  <v-app style="height: 100%">
    <!-- Top bar for logo and text -->
    <v-app-bar color="#c9d4e6ff" dense>
      <v-toolbar-title class="d-flex align-center">
        <v-img src="@/assets/logos/logo.png" height="30" contain></v-img>
        <span class="brand-text">COD3S</span>
      </v-toolbar-title>
    </v-app-bar>

    <!-- Content area -->
    <v-main class="main-content">
      <v-container fluid class="fill-height">
        <v-row class="fill-height">
          <!-- Left sidebar for navigation -->
          <v-col cols="2" class="sidebar-left">
            <!-- System name section -->
            <v-list-subheader class="system-name">{{ systemName }}</v-list-subheader>
            <!-- Navigation links -->
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

          
          <v-col cols="8">
            <router-view></router-view>
          </v-col>
          <v-col cols="2" class="sidebar-right">
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

    onMounted(async () => {
      systemName.value = await modelService.fetchSystemName();
    });

    watch(() => route.path, (newPath) =>{
      if (newPath !== '/simulation') {
        showSimulationComponent.value = false;
      }
    }, { immediate: true });

    return { systemName, showSimulationComponent };
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
  
}

.navigation{
  background-color: #c9d4e6ff !important;
}

</style>
