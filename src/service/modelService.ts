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

  async fetchDocuments() {
    const response = await axios.get(config.apiBaseUrl);
    return response.data.data[0]; 
  },

  async deleteDocument(itemName) {
    const url = `${config.apiBaseUrl}/${itemName}`;
    const response = await axios.delete(url);
    return response.status; 
  },

  async fetchDocumentPath(itemName) {
    const response = await axios.get(`${config.apiBaseUrl}/${itemName}`);
    return response.data.data[0].name; 
  },

  async addDocument(name, path) {
    const fileData = {
      name: name,
      path: path
    };
    const response = await axios.post(config.apiBaseUrl, fileData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data; 
  }, 

   /*async fetchComponentNames(path: string): Promise<string[]> {
    try {
      const response = await axios.get(`http://localhost:8000/document/components-names/${path}`);
      if (response.data && response.data.components) {
        return response.data.components;
      }
      return [];
    } catch (error) {
      console.error('Error fetching component names:', error);
      return [];
    }
  }*/
  
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
  }
};