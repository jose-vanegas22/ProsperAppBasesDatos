import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Cada quien define su propia IP local en Frontend/.env (ver .env.example)
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    'Falta EXPO_PUBLIC_API_URL. Copia Frontend/.env.example a Frontend/.env y coloca tu IP local.',
  );
}

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
