// src/store/simulationStore.ts
import { defineStore } from 'pinia';
import modelService from '@/service/modelService';

export const useSimulationStore = defineStore({
  id: 'simulation',
  state: () => ({
    simulationStatus: '',
    needDiagramRefresh: false,
    tsLastModification: 0, 
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
    async checkForUpdates() {
      try {
        const newTs = await modelService.fetchTsLastModification();
        if (newTs !== this.tsLastModification) {
          this.tsLastModification = newTs;
          this.needDiagramRefresh = true;
          
          
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
      }
    },
    startPeriodicCheck() {
      setInterval(() => {
        this.checkForUpdates();
      }, 4000); 
    },

    resetRefresh() {
      this.needDiagramRefresh = false; 
    }
  }
});
