// modelService.ts
import axios from 'axios';
import config from '@/config/globals';


export default {
  async loadJsonData(filePath: string) {
    const url = `${config.apiBaseUrl}/extracted-content/${filePath}`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.data && response.data.data[0]) {
        return response.data.data[0];
      } else {
        
        throw new Error('No data found at the given path.');
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

  async addDocument(fileData) {
    const response = await axios.post(config.apiBaseUrl, fileData);
    return response.data; 
  }
 
};