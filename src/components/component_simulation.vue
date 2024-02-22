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

<script lang="ts">
import modelService from '@/service/modelService'
export default {
  data: () => ({
    nbruns: 100, // Nombre d'exécutions par défaut
    Datestart: 0.0, // Heure de début par défaut
    Dateend: 24.0, // Heure de fin par défaut
    nbpoints: 100, // Nombre de points par défaut
    showError: false, // Contrôle l'affichage de l'alerte d'erreur
    errorMessage: '', // Message d'erreur à afficher
     // Règles de validation pour les champs numériques
    numberRules: [
      v => !isNaN(parseFloat(v)) && isFinite(v) && v >= 0 || 'Must be a positive number',
    ],
    // Règles de validation pour les champs de type flottant
    floatRules: [
      v => !isNaN(parseFloat(v)) && isFinite(v) || 'Must be a number',
      v => v.toString().match(/^-?\d*(\.\d+)?$/) || 'Must be a float',
    ],
    
  }),

  methods: {
    // Fonction asynchrone pour démarrer la simulation avec les paramètres spécifiés
    async startSim() {
      const simulationParams = { // Préparation des paramètres de simulation
        nb_runs: this.nbruns,
        schedule: [
          {
            start: this.Datestart,
            end: this.Dateend,
            nvalues: this.nbpoints
          }
        ]
      };

      try {
        // Appel au service pour démarrer la simulation et attend la réponse
        const data = await modelService.startSimulation2(simulationParams);
        // Émet un événement avec l'ID de session de la simulation démarrée
        this.$emit('simulation-started', data.session_id);
        this.showError = false; // En cas de succès, assurez-vous que l'alerte n'est pas affichée
      } catch (error) {
        console.error('Failed to start simulation:', error);
        this.errorMessage = 'Erreur lors du démarrage de la simulation. Veuillez réessayer.'; // Personnalisez ce message au besoin
        this.showError = true; // Affiche l'alerte d'erreur
      }
    },
   
  },
}
</script>
