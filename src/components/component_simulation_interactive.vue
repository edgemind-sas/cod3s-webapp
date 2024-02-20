<template>
  <v-container>
    <!-- Barre d'outils pour les contrôles de la simulation -->
    <v-toolbar class="simulationInteractive" flat dense>
      <!-- Bouton pour démarrer la simulation -->
      <v-btn
        icon
        color="green"
        @click="startSimulation"
        :disabled="isSimulationRunning"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
       <!-- Bouton pour arrêter la simulation -->
      <v-btn
        icon
        color="red"
        @click="stopSimulation"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-stop</v-icon>
      </v-btn>
      <!-- Bouton pour revenir en arrière dans la simulation -->
      <v-btn
        icon
        color="orange"
        @click="goBackward"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <!-- Bouton pour avancer dans la simulation -->
      <v-btn
        icon
        color="blue"
        @click="goForward"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Séparateur visuel -->
    <div class="separator"></div>

    <!-- Table virtuelle pour afficher les transitions de la simulation -->
    <v-data-table-virtual
      :headers="headers"
      :items="transitions"
      item-value="trans_id"
      class="full-width scrollable-table"
      height="400"
      @click:row="handleRowClick"
    >
      <template v-slot:item.occ_law="{ value }">
        <!-- Formatage personnalisé pour la colonne de loi d'occurrence -->
        {{ formatOccLaw(value) }}
      </template>
    </v-data-table-virtual>
    <!-- Séparateur visuel -->
    <div class="separator"></div>
    <!-- div pour afficher le temps actuel de la transition -->
    <div>current time: {{ currentTime }}</div>
    <!-- Séparateur visuel -->
    <div class="separator"></div>
    <div>
      <!-- Table virtuelle pour afficher les sequences de la simulation -->
      <v-data-table-virtual
      :headers="headers_sequence"
      :items="sequences"
      class="full-width scrollable-table"
      height="400"
    >
  </v-data-table-virtual>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useSimulationStore } from "@/store/simulationStore";
import modelService from "@/service/modelService";

export default defineComponent({
  setup() {
    const simulationStore = useSimulationStore(); // Accès au store de simulation
    const transitions = ref([]); // Stocke les transitions de simulation
    const sequences = ref([]); // Stocke les séquences de simulation
    const currentTime = ref(0); // Temps actuel de la simulation
    const isSimulationRunning = computed(
      () => simulationStore.simulationStatus === "started"
    ); // Calcul si la simulation est en cours

     // Définition des en-têtes pour les tables de transitions 
    const headers = [
      { title: "Name", key: "comp_name" },
      { title: "Target", key: "target" },
      { title: "Date", key: "end_time" },
      { title: "Law", key: "occ_law" },
    ];
    
     // Définition des en-têtes pour les tables de séquences
    const headers_sequence = [
      { title: "Date", key: "end_time" },
      { title: "Component", key: "comp_name" },
      { title: "State", key: "target" },
    ];

    // Surveille le besoin de rafraîchir les données de simulation
    watch(
      () => simulationStore.needDiagramRefresh,
      (newVal) => {
        if (newVal) {
          refreshTable();
          simulationStore.resetRefresh();
        }
      }
    );

    // Fonction pour rafraîchir les données affichées dans les tables de l'interface utilisateur.
    async function refreshTable() {
      try {
         // Effectue une requête asynchrone pour récupérer les transitions depuis le service de modèle.
        const response = await modelService.fetchTransitions();
        // Effectue une requête asynchrone pour récupérer les séquences depuis le service de modèle.
        const responce2 = await modelService.fetchSequences();
        // Met à jour les données des transitions avec la réponse obtenue.
        transitions.value = response.transitions;
        // Met à jour le temps actuel de la simulation avec la réponse obtenue.
        currentTime.value = response.current_time;
        // Met à jour les données des séquences avec la réponse obtenue.
        sequences.value = responce2.sequence.transitions;
      } catch (error) {
        console.log("An error occurred while fetching the transitions:", error);
      }
    }

    // Hook `onMounted` qui s'exécute après que le composant est monté dans le DOM.
    onMounted(async () => {
      // Démarre une vérification périodique du statut de la simulation.
      simulationStore.startPeriodicCheck();
       // Rafraîchit les données des tables à l'initialisation du composant.
      refreshTable();
    });

    // Gestionnaire d'événements pour les clics sur les lignes de la table.
    const handleRowClick = (click: any, row: any) => {
      try {
        // Utilise le store de simulation pour avancer jusqu'à un ID spécifique dans la simulation.
        simulationStore.goForwardID(row.item.trans_id);
      } catch (error) {
        console.error("Error in forwarding with ID:", error);
      }
    };

    // Fonction pour formater la loi d'occurrence pour l'affichage.
    const formatOccLaw = (occLaw: any) => {
      // Vérifie si occLaw est défini et est un objet.
      if (!occLaw || typeof occLaw !== "object") {
        return "";
      }
      // Formate le nom de la classe en supprimant "OccDistribution".
      let result = occLaw.cls.replace("OccDistribution", "");
      // Filtre et formate les attributs supplémentaires pour l'affichage.
      const additionalAttributes = Object.keys(occLaw)
        .filter((key) => key !== "cls" && occLaw[key] !== undefined)
        .map((key) => `${key}=${occLaw[key]}`)
        .join(", ");
        // Ajoute les attributs formatés au résultat, si présents.
      if (additionalAttributes) {
        result += `(${additionalAttributes})`;
      }
      return result;
    };

    // Exposition des fonctions et des données au template pour utilisation.
    return {
      startSimulation: simulationStore.startSimulation,
      goBackward: simulationStore.goBackward,
      goForward: simulationStore.goForward,
      stopSimulation: simulationStore.stopSimulation,
      transitions,
      headers,
      handleRowClick,
      currentTime,
      refreshTable,
      isSimulationRunning,
      formatOccLaw,
      headers_sequence, 
      sequences
    };
  },
});
</script>

<style scoped>
.simulationInteractive {
  background-color: #c9d4e6ff;
  font-family: "Open Sans", sans-serif;
}

.separator {
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #0a0a0a;
}

.full-width {
  width: 100%;
  margin-left: -30;
  background-color: #c9d4e6ff;
}
.v-data-table {
  margin-left: -10;
}
.v-container {
  padding-left: 0;
  padding-right: 0;
}
.scrollable-table {
  max-height: 400px;
  overflow-y: auto;
}
</style>