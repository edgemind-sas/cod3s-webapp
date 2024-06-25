// modelService.ts
import axios, { AxiosError } from 'axios';
import config from '@/config/globals';  
import { error } from 'console';
import { useAuthStore } from '@/store/authStore';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const authStore = useAuthStore();

    if (error.response && error.response.status === 401) {
      authStore.logout();
      router.push({ name: 'Login' });
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

function getAuthHeaders() {
  const authStore = useAuthStore();
  const token = authStore.token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export default {
  async loadJsonData() {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}system_viz/`,
        {
          headers: getAuthHeaders()
        }
      );
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
      const response = await axios.get(
        `${config.apiBaseUrl}project/`,
        {
          headers: getAuthHeaders()
        }
      );
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
    return axios.post(
      `${config.apiBaseUrl}interactive_simulation/start/`,
      {}, 
      {
        headers: getAuthHeaders()
      }
    );
  },

  goBackward() {
    return axios.post(
      `${config.apiBaseUrl}interactive_simulation/backward/`,
      {},  
      {
        headers: getAuthHeaders()
      }
    );
  },

  goForward() {
    return axios.post(
      `${config.apiBaseUrl}interactive_simulation/forward/`,
      {},  
      {
        headers: getAuthHeaders()
      }
    );
  },

  stopSimulation() {
    return axios.post(
      `${config.apiBaseUrl}interactive_simulation/stop/`,
      {},  
      {
        headers: getAuthHeaders()
      }
    );
  },

  async fetchTransitions() {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}interactive_simulation/fireable_transitions/`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transitions:", error);
      return [];
    }
  },

  async goForwardID(transition_id: any) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}interactive_simulation/forward/?transition_id=${transition_id}`,
        {},  
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error going forward with ID:", error);
      throw error;
    }
  },

  async fetchUpdatedComponents(): Promise<any> {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}system_viz_update/`,
        {},  
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des composants mis à jour:', error);
      throw error;
    }
  },

  async fetchSequences() {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}interactive_simulation/sequence/`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sequences:", error);
      return [];
    }
  },

  async updatePositions(positions: any): Promise<any> {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}front_cfg/positions/`,
        positions,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des positions:', error);
      throw error;
    }
  },

  async fetchTsLastModification() {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}ts_last_modification/`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data.ts_last_modification;
    } catch (error) {
      console.error('Erreur lors de la récupération de ts_last_modification:', error);
      throw error;
    }
  },

  async getComponentDetails(name: string) {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}components/?name=${name}`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data.components[0];
    } catch (error) {
      console.error('Error fetching component details:', error);
    }
  },

  async startSimulation2(simulationParams: any): Promise<any> {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}simulation/run/`,
        {
          simu_params: simulationParams
        },
        {
          headers: getAuthHeaders()
        }
      );
      return response.data; 
    } catch (error) {
      console.error('Error starting simulation:', error);
      throw error; 
    }
  },

  async fetchSimulationIndicators(sessionId: string) {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}simulation/indicators/?session_id=${sessionId}`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des indicateurs de simulation:', error);
      throw error;
    }
  },

  async updateFrontConfig(layoutConfig: any): Promise<any> {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}front_cfg/layout/`,
        {
          layout: layoutConfig
        },
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration du front-end:', error);
      throw error;
    }
  },

  async getFrontConfig(): Promise<any> {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}front_cfg/layout/`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration du front-end:', error);
      throw error;
    }
  },

  async login(email: any, password: any) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);
  
    try {
      const response = await axios.post(`${config.apiBaseUrl}auth/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log("Response from login:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during login:', error.response);
      } else {
        console.error('Error during login:', error);
      }
      throw error;
    }
  },

  async register(first_name: any, last_name: any, email: any, password: any, roles: any) {
    const userData = {
      first_name,
      last_name,
      email,
      password,
      roles
    };
    try {
      const response = await axios.post(`${config.apiBaseUrl}auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) { 
        console.error('Error during login:', error.response);
      } else {
        console.error('Error during login:', error);
      }
      throw error; 
    }
  },
};
