import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as taskApi from '../../api/tasks.api';

export default function ProjectBoardScreen({ route, navigation }) {
  const { proyectoId, rol } = route.params;
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTablero();
  }, []);

  const loadTablero = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getProjectSections(proyectoId);
      setSecciones(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el tablero.');
    } finally {
      setLoading(false);
    }
  };

  // RF 7, 11: Mover tarea validando las subtareas asociadas
  const intentarMoverTarea = async (tarea, nuevaSeccionId) => {
    // Validación frontend (RF 11)
    const subtareasPendientes = tarea.subtareas?.some(st => !st.estadoSubtarea);
    
    if (subtareasPendientes) {
      Alert.alert(
        'Acción Bloqueada',
        'El sistema no permite cambiar una tarea de sección si tiene subtareas incompletas.'
      );
      return;
    }

    try {
      await taskApi.moveTask(tarea.tareaId, nuevaSeccionId);
      loadTablero(); // Recarga el tablero al completarse con éxito
    } catch (error) {
      Alert.alert('Error de Servidor', error.response?.data?.message || 'Error al mover.');
    }
  };

  const renderTarea = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { tareaId: item.tareaId, rol })}
    >
      <Text style={styles.taskName}>{item.nombreTarea}</Text>
      <Text style={styles.priority}>Prioridad: {item.prioridad === 3 ? 'Alta' : item.prioridad === 2 ? 'Media' : 'Baja'}</Text>
    </TouchableOpacity>
  );

  const renderSeccion = ({ item }) => (
    <View style={styles.column}>
      <View style={[styles.columnHeader, { borderLeftColor: item.color || '#4F46E5' }]}>
        <Text style={styles.columnTitle}>{item.nombreSeccion}</Text>
      </View>
      <FlatList
        data={item.tareas || []}
        keyExtractor={(tarea) => tarea.tareaId.toString()}
        renderItem={renderTarea}
        contentContainerStyle={styles.taskContainer}
        ListEmptyComponent={<Text style={styles.emptyTask}>Sin tareas aquí</Text>}
      />
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color="#4F46E5" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={secciones}
        horizontal
        keyExtractor={(sec) => sec.seccionId.toString()}
        renderItem={renderSeccion}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.boardContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center' },
  boardContainer: { paddingVertical: 16, paddingHorizontal: 8 },
  column: { width: 280, backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 8, padding: 12, maxHeight: '95%' },
  columnHeader: { borderLeftWidth: 4, paddingLeft: 8, marginBottom: 12 },
  columnTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  taskContainer: { paddingBottom: 16 },
  taskCard: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  taskName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  priority: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  emptyTask: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginVertical: 8 }
});