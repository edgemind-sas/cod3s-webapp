// modelService.ts
import axios from 'axios';
import config from '@/config/globals';  
import { error } from 'console';

export default {
  async loadJsonData() {
    try {
      const response = await axios.get(`${config.apiBaseUrl}system_viz/`);
      if (response.data) {
        return response.data;
      } else {
        throw new Error('Invalid JSON data');
      }
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw new Error('Failed to load JSON data.');
    }
  },
  
  async fetchSystemName() {
   
    try {
      const response = await axios.get(`${config.apiBaseUrl}project/`);
      if (response.data.project) {
        return response.data.project.system_name;
      } else {
        throw new Error('Invalid JSON data');
      }
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw new Error('Failed to load JSON data.');
    }
  },

  startSimulation() {
    return axios.post(`${config.apiBaseUrl}interactive_simulation/start/`);  
  },
  goBackward() {
    return axios.post(`${config.apiBaseUrl}interactive_simulation/backward/`);  
  },

  goForward() {
    return axios.post(`${config.apiBaseUrl}interactive_simulation/forward/`);  
  }, 
  stopSimulation(){
    return axios.post(`${config.apiBaseUrl}interactive_simulation/stop/`);  
  }, 
  async fetchTransitions() {
    try {
      const response = await axios.get(`${config.apiBaseUrl}interactive_simulation/fireable_transitions/`);  
      return response.data;
    } catch (error) {
      console.error("Error fetching transitions:", error);
      return [];
    }
  },
  async goForwardID(transition_id) {
    try {
      const response = await axios.post(`${config.apiBaseUrl}interactive_simulation/forward/?transition_id=${transition_id}`);  
      return response.data;
    } catch (error) {
      console.error("Error going forward with ID:", error);
      throw error;
    }
  },
  async fetchUpdatedComponents(): Promise<any> {
    try {
        const response = await axios.post(`${config.apiBaseUrl}system_viz_update/`, {});  
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des composants mis à jour:', error);
        throw error;
    }
  },
  async fetchSequences(){
    try{
        const response = await axios.get(`${config.apiBaseUrl}interactive_simulation/sequence/`)
        return response.data;
    }catch(error)
    {
      console.error("Error fetching sequences:", error);
      return []
    }
  }, 

  async updatePositions(positions: any): Promise<any> {
    try {
        const response = await axios.post(`${config.apiBaseUrl}front_cfg/positions/`, positions);  
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des positions:', error);
        throw error;
    }
  },
  async fetchTsLastModification() {
    try {
      const response = await axios.get(`${config.apiBaseUrl}ts_last_modification/`);
      return response.data.ts_last_modification;
    } catch (error) {
      console.error('Erreur lors de la récupération de ts_last_modification:', error);
      throw error;
    }
  },
  async getComponentDetails(name: string) {
    try {
      // Utilisez `name` au lieu de `componentName` dans l'URL
      const response = await axios.get(`${config.apiBaseUrl}components/?name=${name}`);
      //console.log(response.data.components[0]);
      
      return response.data.components[0];

    } catch (error) {
      console.error('Error fetching component details:', error);
    }
  }, 
  async startSimulation2(simulationParams: any): Promise<any> {
    try {
      const response = await axios.post(`${config.apiBaseUrl}simulation/run/`, {
        simu_params: simulationParams
      });
      return response.data; 
    } catch (error) {
      console.error('Error starting simulation:', error);
      throw error; 
    }
  },
  // Méthode pour récupérer les indicateurs de simulation
  async fetchSimulationIndicators(sessionId: string) {
    try {
      const response = await axios.get(`${config.apiBaseUrl}simulation/indicators/?session_id=${sessionId}`);
      return response.data; // Retourne les données JSON de la réponse
    } catch (error) {
      console.error('Erreur lors de la récupération des indicateurs de simulation:', error);
      throw error; // Propager l'erreur pour la gestion d'erreur dans le composant
    }
  }, 
  async updateFrontConfig(layoutConfig: any): Promise<any> {
    try {
      const response = await axios.post(`${config.apiBaseUrl}front_cfg/layout/`, {
        layout: layoutConfig
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration du front-end:', error);
      throw error;
    }
  },

  async getFrontConfig(): Promise<any> {
    try {
      const response = await axios.get(`${config.apiBaseUrl}front_cfg/layout/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration du front-end:', error);
      throw error;
    }
  },

  
};
