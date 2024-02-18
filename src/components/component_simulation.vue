<template>
  <v-sheet width="300" class="mx-auto">
    <v-form ref="form">
      <!-- nb runs -->
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
    nbruns: 0,
    Datestart: 0.0,
    Dateend: 0.0,
    nbpoints: 0,
    numberRules: [
      v => !isNaN(parseFloat(v)) && isFinite(v) && v >= 0 || 'Must be a positive number',
    ],
    floatRules: [
      v => !isNaN(parseFloat(v)) && isFinite(v) || 'Must be a number',
      v => v.toString().match(/^-?\d*(\.\d+)?$/) || 'Must be a float',
    ],
    
  }),

  methods: {
    async startSim() {
      const simulationParams = {
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
        const data = await modelService.startSimulation2(simulationParams);
        console.log('Simulation started successfully. Session ID:', data.session_id);
        this.$emit('simulation-started', data.session_id);
        // Vous pouvez ici traiter le session_id comme nécessaire
      } catch (error) {
        console.error('Failed to start simulation:', error);
        // Gestion de l'erreur (par exemple, afficher un message à l'utilisateur)
      }
    },
    reset() {
      this.$refs.form.reset()
    },
  },
}
</script>
