import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

import DashboardPage from '../pages/DashboardPage';
import ProyectosPage from '../pages/proyectos/ProyectosPage';
import DetalleProyectoPage from '../pages/proyectos/DetalleProyectoPage';
import DetalleTareaPage from '../pages/tareas/DetalleTareaPage';
import PerfilPage from '../pages/perfil/PerfilPage';

const Tab = createBottomTabNavigator();
const ProyectosStack = createNativeStackNavigator();

function CerrarSesionBoton() {
  const { cerrarSesion } = useAuth();
  return (
    <TouchableOpacity onPress={cerrarSesion} style={{ marginRight: 16 }}>
      <Text style={{ color: '#FF6B6B', fontWeight: '600' }}>Salir</Text>
    </TouchableOpacity>
  );
}

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#0D2137' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '600' },
  headerBackButtonDisplayMode: 'minimal',
};

function ProyectosStackScreen() {
  return (
    <ProyectosStack.Navigator screenOptions={stackScreenOptions}>
      <ProyectosStack.Screen
        name="ProyectosList"
        component={ProyectosPage}
        options={{ headerShown: false, title: 'Proyectos' }}
      />
      <ProyectosStack.Screen
        name="DetalleProyecto"
        component={DetalleProyectoPage}
        options={{ title: 'Proyecto' }}
      />
      <ProyectosStack.Screen
        name="DetalleTarea"
        component={DetalleTareaPage}
        options={{ title: 'Tarea' }}
      />
    </ProyectosStack.Navigator>
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
        component={ProyectosStackScreen}
        options={({ route }) => {
          const rutaActiva = getFocusedRouteNameFromRoute(route) ?? 'ProyectosList';
          return { title: 'Proyectos', headerShown: rutaActiva === 'ProyectosList' };
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilPage}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
