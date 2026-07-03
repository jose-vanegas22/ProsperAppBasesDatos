import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

import DashboardPage from '../pages/DashboardPage';
import ProyectosPage from '../pages/proyectos/ProyectosPage';

const Tab = createBottomTabNavigator();

function CerrarSesionBoton() {
  const { cerrarSesion } = useAuth();
  return (
    <TouchableOpacity onPress={cerrarSesion} style={{ marginRight: 16 }}>
      <Text style={{ color: '#FF6B6B', fontWeight: '600' }}>Salir</Text>
    </TouchableOpacity>
  );
}

export default function MainLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D2137' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerRight: () => <CerrarSesionBoton />,
        tabBarActiveTintColor: '#0D2137',
        tabBarInactiveTintColor: '#8BAFD4',
        tabBarStyle: { borderTopColor: '#e5e7eb' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardPage}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Proyectos"
        component={ProyectosPage}
        options={{ title: 'Proyectos' }}
      />
    </Tab.Navigator>
  );
}
