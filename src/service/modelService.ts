// modelService.ts
import axios from 'axios';
import config from '@/config/globals';


export default {
  async loadJsonData() {
    const url = "http://localhost:8000/system_viz/";
    try {
      const response = await axios.get(url);
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
    const url = "http://localhost:8000/project/ ";
    try {
      const response = await axios.get(url);
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
    return axios.post('http://localhost:8000/interactive_simulation/start/');
  },
  goBackward() {
    return axios.post('http://localhost:8000/interactive_simulation/backward/');
  },

  goForward() {
    return axios.post('http://localhost:8000/interactive_simulation/forward/');
  }, 
  stopSimulation(){
    return axios.post('http://localhost:8000/interactive_simulation/stop/');
  }, 
  async fetchTransitions() {
    try {
      const response = await axios.get("http://localhost:8000/interactive_simulation/fireable_transitions/");
      return response.data;
    } catch (error) {
      console.error("Error fetching transitions:", error);
      return [];
    }
  },
  async goForwardID(transition_id) {
    try {
      const response = await axios.post(`http://localhost:8000/interactive_simulation/forward/?transition_id=${transition_id}`);
      return response.data;
    } catch (error) {
      console.error("Error going forward with ID:", error);
      throw error;
    }
  },
 
};