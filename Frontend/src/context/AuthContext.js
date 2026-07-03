import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../services/auth.service';
import { registrar } from '../services/usuario.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const datos = await AsyncStorage.getItem('usuario');
        if (token && datos) {
          setUsuario(JSON.parse(datos));
        }
      } catch (_) {
      } finally {
        setCargando(false);
      }
    };
    cargarSesion();
  }, []);

  const login = async (email, contrasena) => {
    const { data } = await loginService(email, contrasena);
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const registro = async (datos) => {
    await registrar(datos);
    await login(datos.email, datos.contrasena);
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
