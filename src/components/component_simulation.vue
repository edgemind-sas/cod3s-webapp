<template>
  <!-- Définit une feuille (conteneur) avec une largeur fixe centrée horizontalement -->
  <v-sheet width="300" class="mx-auto">
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

        <!-- Bouton pour réinitialiser le formulaire de simulation -->
        <v-btn color="error" class="mt-4" block @click="reset">
          Reset Simulation
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
      } catch (error) {
        console.error('Failed to start simulation:', error);
      }
    },
    // Réinitialise le formulaire à ses valeurs par défaut
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>
