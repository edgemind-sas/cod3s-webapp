<template>
  <!-- Définit une feuille (conteneur) avec une largeur fixe centrée horizontalement -->
  <v-sheet width="300" class="mx-auto">
    <!-- Ajout d'un composant v-alert pour afficher les erreurs -->
    <v-alert type="error" v-model="showError">
      {{ errorMessage }}
    </v-alert>

    <!-- Formulaire pour la saisie des données de simulation -->
    <v-form ref="form">
      <!-- Champ de texte pour le nombre d'exécutions -->
      <v-text-field
        v-model.number="nbruns"
        label="nb runs" 
        :rules="numberRules" 
        required
        type="number"
      ></v-text-field>

      <!-- Champ de texte pour la date de début -->
      <v-text-field
        v-model.number="Datestart"
        label="Date start (numeric, float)"
        :rules="floatRules" 
        required
        type="text" 
      ></v-text-field>

      <!-- Champ de texte pour la date de fin -->
      <v-text-field
        v-model.number="Dateend"
        label="Date end (numeric, float)"
        :rules="floatRules" 
        required
        type="text" 
      ></v-text-field>

      <!-- Champ de texte pour le nombre de points -->
      <v-text-field
        v-model.number="nbpoints"
        label="nb. points"
        :rules="numberRules"
        required
        type="number"
      ></v-text-field>

      <div class="d-flex flex-column">
        <!-- Bouton pour démarrer la simulation -->
        <v-btn color="success" class="mt-4" block @click="startSim">
          <v-icon>mdi-play</v-icon>
          Start Simulation
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import modelService from '@/service/modelService';

// Émission d'événements
const emit = defineEmits(['simulation-started']);

// Références réactives pour les champs du formulaire
const nbruns = ref(100); // Nombre d'exécutions par défaut
const Datestart = ref(0.0); // Heure de début par défaut
const Dateend = ref(24.0); // Heure de fin par défaut
const nbpoints = ref(100); // Nombre de points par défaut

// Références réactives pour la gestion des erreurs
const showError = ref(false); // Contrôle l'affichage de l'alerte d'erreur
const errorMessage = ref(''); // Message d'erreur à afficher

// Règles de validation pour les champs numériques
const numberRules = [
  (v: number) => !isNaN(parseFloat(v.toString())) && isFinite(v) && v >= 0 || 'Must be a positive number',
];

// Règles de validation pour les champs de type flottant
const floatRules = [
  (v: number) => !isNaN(parseFloat(v.toString())) && isFinite(v) || 'Must be a number',
  (v: number) => v.toString().match(/^-?\d*(\.\d+)?$/) || 'Must be a float',
];

// Fonction asynchrone pour démarrer la simulation avec les paramètres spécifiés
const startSim = async () => {
  const simulationParams = {
    nb_runs: nbruns.value,
    schedule: [
      {
        start: Datestart.value,
        end: Dateend.value,
        nvalues: nbpoints.value
      }
    ]
  };

  try {
    // Appel au service pour démarrer la simulation et attend la réponse
    const data = await modelService.startSimulation2(simulationParams);
    // Émet un événement avec l'ID de session de la simulation démarrée
    emit('simulation-started', data.session_id);
    showError.value = false; // En cas de succès, assurez-vous que l'alerte n'est pas affichée
  } catch (error) {
    console.error('Failed to start simulation:', error);
    errorMessage.value = 'Erreur lors du démarrage de la simulation. Veuillez réessayer.'; // Personnalisez ce message au besoin
    showError.value = true; // Affiche l'alerte d'erreur
  }
};
</script>

<style scoped>
/* Ajoutez les styles requis ici */
</style>
