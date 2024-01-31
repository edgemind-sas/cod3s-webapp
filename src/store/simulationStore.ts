// src/store/simulationStore.ts
import { defineStore } from 'pinia';
import modelService from '@/service/modelService';

export const useSimulationStore = defineStore({
  id: 'simulation',
  state: () => ({
    simulationStatus: '',
    needDiagramRefresh: false, 
  }),
  actions: {
    async startSimulation() {
      try {
        await modelService.startSimulation();
        this.simulationStatus = 'started';
        this.needDiagramRefresh = true;
      } catch (error) {
        console.error('Error starting simulation:', error);
      }
    },
    async goBackward() {
      try {
        await modelService.goBackward();
        this.needDiagramRefresh = true; 
      } catch (error) {
        console.error('Error going backward:', error);
      }
    },
    async goForward() {
      try {
        await modelService.goForward();
        this.needDiagramRefresh = true; 
      } catch (error) {
        console.error('Error going forward:', error);
      }
    },
    async stopSimulation() {
      try {
        await modelService.stopSimulation();
        this.simulationStatus = 'stoped';
        this.needDiagramRefresh = true; 
      } catch (error) {
        console.error('Error starting simulation:', error);
      }
    },
    async goForwardID(transition_id) {
      try {
        await modelService.goForwardID(transition_id);
        this.needDiagramRefresh = true;
      } catch (error) {
        console.error('Error going forward with ID:', error);
      }
    },
   
    resetRefresh() {
      this.needDiagramRefresh = false; 
    }
  }
});
