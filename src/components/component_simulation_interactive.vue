<template>
    <v-container>
      <v-toolbar class="simulationInteractive" flat dense>
        <v-btn icon color="green" @click="startSimulation">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="stopSimulation">
          <v-icon>mdi-stop</v-icon >
        </v-btn>
        <v-btn icon color="orange" @click="goBackward">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn icon color="blue" @click="goForward">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="separator"></div>
      <v-data-table
      :headers="headers"
      :items="transitions"
      item-key="trans_id"
      class="full-width"
    >
      <template v-slot:item="{ item }">
        <tr @click="handleRowClick(item)">
          <td>{{ item.trans_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.target }}</td>
          <td>{{ item.end_time }}</td>
          <td>{{ item.occ_law.time }}</td>
        </tr>
      </template>
    </v-data-table>
    <div class="separator"></div>
    <div>current time: {{ currentTime }}</div>
    <div class="separator"></div>
    <div></div>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useSimulationStore } from '@/store/simulationStore';
  import modelService from "@/service/modelService"
  
  export default defineComponent({
    setup() {
      const simulationStore = useSimulationStore(); 
      const transitions = ref([]);
      const currentTime = ref(0);
  
      const headers = [
        { text: 'Trans ID', value: 'trans_id' },
        { text: 'Name', value: 'name' },
        { text: 'Target', value: 'target' },
        { text: 'Date', value: 'end_time' },
        { text: 'Law', value: 'occ_law.time' },
      ];
  
      onMounted(async () => {
        const response = await modelService.fetchTransitions();
  transitions.value = response.transitions; 
  currentTime.value = response.current_time;
      });
  
      const handleRowClick = (row: any) => {
        console.log('Row clicked:', row.trans_id);
      };
      
      return {
        startSimulation: simulationStore.startSimulation,
        goBackward: simulationStore.goBackward,
        goForward: simulationStore.goForward,
        stopSimulation: simulationStore.stopSimulation,
        transitions, 
        headers,
        handleRowClick,
        currentTime 
      };
    },
  });
  </script>
  
  
  <style scoped> 
      .simulationInteractive{
          background-color:#c9d4e6ff ;
          font-family: 'Open Sans', sans-serif
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
</style>
  