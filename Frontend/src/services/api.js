import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.20.54:3000/api'; // Android emulator → localhost
// const API_URL = 'http://localhost:3000/api'; // iOS simulator
// const API_URL = 'http://TU_IP:3000/api';     // dispositivo físico

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Agrega el token JWT automáticamente en cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
