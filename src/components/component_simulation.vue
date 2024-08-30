<template>
  <v-sheet width="300" class="mx-auto">
    <v-alert type="error" v-model="showError">
      {{ errorMessage }}
    </v-alert>

    <v-form ref="form">
      <v-text-field
        v-model.number="nbruns"
        label="nb runs" 
        :rules="numberRules" 
        required
        type="number"
      ></v-text-field>

      <v-text-field
        v-model.number="Datestart"
        label="Date start (numeric, float)"
        :rules="floatRules" 
        required
        type="text" 
      ></v-text-field>

      <v-text-field
        v-model.number="Dateend"
        label="Date end (numeric, float)"
        :rules="floatRules" 
        required
        type="text" 
      ></v-text-field>

      <v-text-field
        v-model.number="nbpoints"
        label="nb. points"
        :rules="numberRules"
        required
        type="number"
      ></v-text-field>

      <div class="d-flex flex-column">
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

const emit = defineEmits(['simulation-started']);

const nbruns = ref(100);
const Datestart = ref(0.0);
const Dateend = ref(24.0);
const nbpoints = ref(100);

const showError = ref(false);
const errorMessage = ref('');

// Règles de validation pour les champs numériques
const numberRules: Array<(v: number) => true | string> = [
  (v: number) => !isNaN(parseFloat(v.toString())) && isFinite(v) && v >= 0 || 'Must be a positive number',
];

// Règles de validation pour les champs de type flottant
const floatRules: Array<(v: number) => true | string> = [
  (v: number) => !isNaN(parseFloat(v.toString())) && isFinite(v) || 'Must be a number',
  (v: number) => /^-?\d*(\.\d+)?$/.test(v.toString()) || 'Must be a float',
];

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
    const data = await modelService.startSimulation2(simulationParams);
    emit('simulation-started', data.session_id);
    showError.value = false;
  } catch (error) {
    console.error('Failed to start simulation:', error);
    errorMessage.value = 'Erreur lors du démarrage de la simulation. Veuillez réessayer.';
    showError.value = true;
  }
};
</script>

<style scoped>
/* Ajoutez les styles requis ici */
</style>
