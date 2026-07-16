import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reemplaza con la IP de tu máquina en la red local (no "localhost":
// el emulador/dispositivo físico no lo resuelve igual). Ej: 'http://192.168.1.15:3000/api'
const BASE_URL = 'http://TU_IP_LOCAL:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@prosperapp:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@prosperapp:token');
      // Cuando conectemos esto con AuthContext, aquí forzaremos
      // la navegación de vuelta a Login
    }
    return Promise.reject(error);
  }
);

export default apiClient;