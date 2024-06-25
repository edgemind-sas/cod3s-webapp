<template>
  <v-app style="height: 100%">

    <!-- Afficher la barre d'app seulement si showLayout est true -->
    <v-app-bar v-if="showLayout" color="#c9d4e6ff" dense>
      <v-toolbar-title class="d-flex align-center">
        <v-img src="@/assets/logos/logo.png" height="30" contain></v-img>
        <span class="brand-text">COD3S</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="main-content">
      <v-container fluid class="fill-height">
        <v-row class="fill-height d-flex flex-nowrap">
          <!-- Afficher la sidebar seulement si showLayout est true -->
          <v-col v-if="showLayout" cols="2" class="sidebar-left">
            <v-list-subheader class="system-name">{{ systemName }}</v-list-subheader>
            <v-list class="navigation" dense>
              <v-list-item link to="/modelisation" class="navigation-link">
                <v-list-item-title>System</v-list-item-title>
              </v-list-item>
              <v-list-item to="/SimulationInteractive" class="navigation-link">
                <v-list-item-title>Interactive simulation</v-list-item-title>
              </v-list-item>
              <v-list-item to="/simulation" class="navigation-link">
                <v-list-item-title>Simulation</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import modelService from "@/service/modelService";
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const systemName = ref(null);
    const route = useRoute();

    onMounted(async () => {
      systemName.value = await modelService.fetchSystemName();
    });
    // Déterminez si la barre latérale et la barre de navigation doivent être affichées
    const showLayout = computed(() => {
      // Liste des chemins où la barre latérale et la barre de navigation ne doivent pas être affichées
      const noLayoutPaths = ['/', '/register'];
      return !noLayoutPaths.includes(route.path);
    });

    return { systemName, showLayout };
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
