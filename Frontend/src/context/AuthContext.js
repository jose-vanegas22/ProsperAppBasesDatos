import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(undefined);
const TOKEN_KEY = '@prosperapp:token';
const USER_KEY = '@prosperapp:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Error cargando sesión guardada', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const { access_token, usuario } = await authApi.login(email, password);
    await AsyncStorage.setItem(TOKEN_KEY, access_token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUser(usuario);
  }

  async function register(datosUsuario) {
    return authApi.register(datosUsuario);
  }

  async function logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setUser(null);
  }

  const value = { user, isLoading, isAuthenticated: !!user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}