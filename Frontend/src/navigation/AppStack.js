import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

// Placeholder temporal — reemplazar por DashboardScreen real.
// No borres este comentario hasta que ese reemplazo esté hecho.
function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, {user?.primerNombre}!</Text>
      <Text style={styles.subtitle}>Dashboard pendiente (Persona B)</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardPlaceholder}
        options={{ title: 'ProsperApp' }}
      />
      {/* Persona B agrega aquí: ProjectBoard, TaskDetail, Collaborators, etc. */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { color: '#868E96' },
});