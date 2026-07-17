import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// CORRECCIÓN 1: Ajustamos la ruta para que entre a la carpeta 'project'
import CreateProjectScreen from '../screens/project/CreateProjectScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProjectBoardScreen from '../screens/project/ProjectBoardScreen';
import TaskDetailScreen from '../screens/task/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4F46E5' }, headerTintColor: '#fff' }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'ProsperApp' }}
      />
      <Stack.Screen
        name="ProjectBoard"
        component={ProjectBoardScreen}
        options={{ title: 'Tablero de Control' }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Detalles de Tarea' }}
      />
      
      {/* CORRECCIÓN 2: Registramos la pantalla para que el Dashboard pueda navegar a ella */}
      <Stack.Screen
        name="CreateProject"
        component={CreateProjectScreen}
        options={{ title: 'Crear Nuevo Proyecto' }}
      />
    </Stack.Navigator>
  );
}