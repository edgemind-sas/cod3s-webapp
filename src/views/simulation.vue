<template>
  <v-row class="fill-height d-flex flex-nowrap">
    <v-col :style="{ flex: '1 1 auto' }">
      <v-card class="edge-mind-theme" style="height: 100vh;">
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab v-for="tabItem in tabs" :key="tabItem.id" :value="tabItem.id">{{ tabItem.name }}</v-tab>
        </v-tabs>
        <v-card-text style="height: 100%;">
          <v-window v-model="tab" style="height: 100%;">
            <v-window-item v-for="tabItem in tabs" :key="tabItem.id" :value="tabItem.id">
              <div style="max-height: 950px; overflow-y: auto;">
                <pre>{{ formattedSimulationIndicators(tabItem.id) }}</pre>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :style="{ flex: '0 0 ' + sidebarWidth + 'px' }" class="sidebar-right">
      <div class="resize-bar" @mousedown="startResize"></div>
      <component_simulation @simulation-started="handleSimulationStarted"></component_simulation>
    </v-col>
  </v-row>
</template>


<script lang="ts">
// Importations nécessaires pour définir le composant, gérer l'état, et interagir avec le routeur et les services
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import component_gojs from '@/components/component_gojs.vue';
import component_simulation from '@/components/component_simulation.vue';
import modelService from '@/service/modelService'; 

export default defineComponent({
  // Enregistrement des composants enfants pour utilisation dans le template
  components: { component_simulation, component_gojs },

  setup() {
    // Utilisation du routeur Vue pour accéder aux informations de la route actuelle
    const route = useRoute();
    // Références réactives pour la gestion de l'état local du composant
    const tab = ref('one'); // Pour le contrôle des onglets
    const sidebarWidth = ref(100); // Largeur initiale de la barre latérale en pixels
    const mainColWidth = ref(900); // Largeur initiale de la colonne principale en pixels
    const sessionId = ref(null); // ID de session pour la simulation, initialement null
    const tabs = ref([]);  // Les onglets, avec un onglet par défaut
    const simulationIndicators = ref({}); ; // Données des indicateurs de simulation, initialement null

     // Formatage des indicateurs de simulation pour affichage
     const formattedSimulationIndicators = (id) => {
      return simulationIndicators.value[id] ? JSON.stringify(simulationIndicators.value[id], null, 2) : '';
    };

    // Fonction pour initier le redimensionnement de la barre latérale
    const startResize = (event: MouseEvent) => {
      const startX = event.clientX; // Position initiale de la souris en X
      const startWidth = sidebarWidth.value; // Largeur initiale de la barre latérale
      const startWidthMainCol = mainColWidth.value; // Largeur initiale de la colonne principale

      // Fonction interne pour effectuer le redimensionnement
      const doResize = async (moveEvent: MouseEvent) => {
        const diffX = moveEvent.clientX - startX; // Calcul du déplacement en X
        // Nouvelles largeurs calculées en respectant les limites minimales
        const newSidebarWidth = Math.max(startWidth - diffX, 50);
        const newMainColWidth = Math.max(window.innerWidth - newSidebarWidth - (startWidthMainCol - startWidth), 100);

        // Mise à jour des largeurs
        sidebarWidth.value = newSidebarWidth;
        mainColWidth.value = newMainColWidth;
      };

      // Fonction pour arrêter le redimensionnement
      const stopResize = async () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
        await modelService.updateFrontConfig({ is_panel_width_simulation: sidebarWidth.value })
          .catch(error => console.error("Erreur lors de la mise à jour de la configuration de la barre latérale:", error));
      };

      // Enregistrement des gestionnaires d'événements
      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    };

    // Gestionnaire pour le démarrage de la simulation
    const handleSimulationStarted = async (id) => {
      tabs.value.push({ id: id, name: `Simulation <${id}>` });
      sessionId.value = id; // Mise à jour de l'ID de session
      try {
        // Récupération des indicateurs de simulation depuis le service
        const indicators = await modelService.fetchSimulationIndicators(sessionId.value);
        simulationIndicators.value[id] = indicators; // Stockage par ID de session
      } catch (error) {
        console.error('Erreur lors de la récupération des indicateurs:', error);
      }
    };

    const loadInitialSidebarConfig = async () => {
  try {
    const config = await modelService.getFrontConfig();
    // Accédez correctement à la configuration selon la structure de la réponse
    if (config.layout && config.layout.is_panel_width_simulation) {
      sidebarWidth.value = config.layout.is_panel_width_simulation;
      // Ajustez mainColWidth en fonction de la nouvelle sidebarWidth
      mainColWidth.value = window.innerWidth - sidebarWidth.value;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la configuration initiale de la barre latérale:", error);
  }
};

    // Hook onMounted vide, potentiellement pour des initialisations futures
    onMounted(async () => {
      loadInitialSidebarConfig();
    });

    // Exposition des propriétés et méthodes pour le template
    return { 
      sidebarWidth,
      startResize,
      mainColWidth, 
      tab,
      sessionId,
      simulationIndicators,
      handleSimulationStarted, 
      formattedSimulationIndicators, 
      tabs
    };
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