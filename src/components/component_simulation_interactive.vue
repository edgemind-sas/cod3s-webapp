<template>
    <v-container>
      <v-toolbar class="simulationInteractive" flat dense>
        <v-btn icon color="green" @click="startSimulation">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon color="red">
          <v-icon>mdi-stop</v-icon>
        </v-btn>
        <v-btn icon color="orange" @click="goBackward">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn icon color="blue" @click="goForward">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-toolbar>
    </v-container>
  </template>

  
<script lang="ts">
import modelService from '@/service/modelService';
export default {
  methods: {
    startSimulation() {
      modelService.startSimulation()
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
    goBackward() {
      modelService.goBackward()
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
    goForward() {
      modelService.goForward()
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  }
}

</script>

<style scoped> 
    .simulationInteractive{
        background-color:#c9d4e6ff ;
        font-family: 'Open Sans', sans-serif

    }

</style>