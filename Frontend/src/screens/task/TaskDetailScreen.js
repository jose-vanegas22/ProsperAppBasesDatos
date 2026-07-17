import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, ActivityIndicator } from 'react-native';
import * as taskApi from '../../api/tasks.api';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';


export default function TaskDetailScreen({ route }) {
  const { tareaId } = route.params;
  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTarea = async () => {
    try {
      const response = await client.get(`/tarea/${tareaId}`); // Ruta API detallada de tarea
      setTarea(response.data);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron recuperar los detalles de la tarea.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarea();
  }, []);

  const handleToggleSubtask = async (subtaskId, currentStatus) => {
    try {
      await taskApi.toggleSubtask(subtaskId, !currentStatus);
      fetchTarea(); // Recargar estado actualizados de subtareas
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la subtarea.');
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tarea?.nombreTarea}</Text>
      <Text style={styles.description}>{tarea?.descripcionTarea}</Text>
      
      <Text style={styles.subtitle}>Subtareas (Checklist):</Text>
      <FlatList
        data={tarea?.subtareas || []}
        keyExtractor={(item) => item.subtareaId.toString()}
        renderItem={({ item }) => (
          <View style={styles.subtaskRow}>
            <Text style={[styles.subtaskText, item.estadoSubtarea && styles.completed]}>
              {item.descripcionSubtarea}
            </Text>
            <Switch
              value={item.estadoSubtarea}
              onValueChange={() => handleToggleSubtask(item.subtareaId, item.estadoSubtarea)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  center: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', marginBottom: 24 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  subtaskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  subtaskText: { fontSize: 14, color: '#374151' },
  completed: { textDecorationLine: 'line-through', color: '#9CA3AF' }
});