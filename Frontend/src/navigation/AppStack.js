import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tus nuevas pantallas de la Persona B
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
    </Stack.Navigator>
  );
}