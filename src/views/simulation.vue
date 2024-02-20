<template>
  <!-- Utilise v-row pour créer une ligne qui remplit la hauteur disponible et empêche l'enveloppement des flex items -->
  <v-row class="fill-height d-flex flex-nowrap">
    
    <!-- Colonne principale prenant l'espace disponible automatiquement -->
    <v-col :style="{ flex: '1 1 auto' }">
      <!-- Carte principale occupant toute la hauteur de la vue -->
      <v-card class="edge-mind-theme" style="height: 100vh;"> 
      
        <!-- Onglets avec un modèle réactif pour le contrôle de l'onglet actif -->
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="one">Simulation{{ sessionId ? ' <' + sessionId + '>' : '' }}</v-tab>
        </v-tabs>

        <!-- Contenu de la carte, occupant 100% de sa hauteur -->
        <v-card-text style="height: 100%;"> 
          <!-- Fenêtre pour le contenu des onglets, correspondant au modèle des onglets -->
          <v-window v-model="tab" style="height: 100%;"> 
            <!-- Élément de fenêtre pour l'onglet "one" -->
            <v-window-item value="one">
              <!-- Affichage conditionnel des indicateurs de simulation avec défilement vertical -->
              <div v-if="simulationIndicators" style="max-height: 950px; overflow-y: auto;">
                <pre>{{ formattedSimulationIndicators }}</pre>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Colonne latérale droite avec largeur fixe redimensionnable -->
    <v-col :style="{ flex: '0 0 ' + sidebarWidth + 'px' }" class="sidebar-right">
      <!-- Barre de redimensionnement -->
      <div class="resize-bar" @mousedown="startResize"></div>
      <!-- Composant de simulation avec gestionnaire d'événement pour le démarrage de la simulation -->
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
    const simulationIndicators = ref(null); // Données des indicateurs de simulation, initialement null

    // Propriété calculée pour formater joliment les indicateurs de simulation en chaîne JSON
    const formattedSimulationIndicators = computed(() => {
      return simulationIndicators.value ? JSON.stringify(simulationIndicators.value, null, 2) : '';
    });

    // Fonction pour initier le redimensionnement de la barre latérale
    const startResize = (event: MouseEvent) => {
      const startX = event.clientX; // Position initiale de la souris en X
      const startWidth = sidebarWidth.value; // Largeur initiale de la barre latérale
      const startWidthMainCol = mainColWidth.value; // Largeur initiale de la colonne principale

      // Fonction interne pour effectuer le redimensionnement
      const doResize = (moveEvent: MouseEvent) => {
        const diffX = moveEvent.clientX - startX; // Calcul du déplacement en X
        // Nouvelles largeurs calculées en respectant les limites minimales
        const newSidebarWidth = Math.max(startWidth - diffX, 50);
        const newMainColWidth = Math.max(window.innerWidth - newSidebarWidth - (startWidthMainCol - startWidth), 100);

        // Mise à jour des largeurs
        sidebarWidth.value = newSidebarWidth;
        mainColWidth.value = newMainColWidth;
      };

      // Fonction pour arrêter le redimensionnement
      const stopResize = () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
      };

      // Enregistrement des gestionnaires d'événements
      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    };

    // Gestionnaire pour le démarrage de la simulation
    const handleSimulationStarted = async (id) => {
      sessionId.value = id; // Mise à jour de l'ID de session
      try {
        // Récupération des indicateurs de simulation depuis le service
        const indicators = await modelService.fetchSimulationIndicators(sessionId.value);
        simulationIndicators.value = indicators;
      } catch (error) {
        console.error('Erreur lors de la récupération des indicateurs:', error);
      }
    };

    // Hook onMounted vide, potentiellement pour des initialisations futures
    onMounted(async () => {
      // Initialisations possibles après le montage du composant
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
      formattedSimulationIndicators
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