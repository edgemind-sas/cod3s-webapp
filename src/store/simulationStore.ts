// src/store/simulationStore.ts
import { defineStore } from 'pinia';
import modelService from '@/service/modelService';

export const useSimulationStore = defineStore({
  id: 'simulation',
  state: () => ({
    simulationStatus: '',
    needDiagramRefresh: false, // Add a boolean flag for refresh control
  }),
  actions: {
    async startSimulation() {
      try {
        await modelService.startSimulation();
        this.simulationStatus = 'started';
        this.needDiagramRefresh = true; // Set the flag to true to indicate a needed refresh
      } catch (error) {
        console.error('Error starting simulation:', error);
      }
    },
    async goBackward() {
      try {
        await modelService.goBackward();
        this.needDiagramRefresh = true; // Set the flag to true to indicate a needed refresh
      } catch (error) {
        console.error('Error going backward:', error);
      }
    },
    async goForward() {
      try {
        await modelService.goForward();
        this.needDiagramRefresh = true; // Set the flag to true to indicate a needed refresh
      } catch (error) {
        console.error('Error going forward:', error);
      }
    },
    resetRefresh() {
      this.needDiagramRefresh = false; 
    }
  }
});
