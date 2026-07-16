import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import * as projectApi from '../../api/projects.api';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth(); // Consumimos el contexto de Persona A
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getProjects();
      setProyectos(data);
    } catch (error) {
      console.error('Error cargando proyectos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const renderProyecto = ({ item }) => {
    // El backend retorna si eres Dueño o Colaborador
    const esCreador = item.usuarioCreadorId === user?.usuarioId;
    const rol = esCreador ? 'Dueño' : 'Colaborador';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProjectBoard', { proyectoId: item.proyectoId, rol })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.projectName}>{item.nombreProyecto}</Text>
          <Text style={[styles.badge, esCreador ? styles.badgeOwner : styles.badgeCollab]}>
            {rol}
          </Text>
        </View>
        <Text style={styles.progressText}>Progreso estimado: {item.progreso ?? 0}%</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hola, {user?.primerNombre} 👋</Text>
        <Button title="Cerrar sesión" onPress={logout} color="#EF4444" />
      </View>

      <Text style={styles.sectionTitle}>Mis Proyectos</Text>
      
      <FlatList
        data={proyectos}
        keyExtractor={(item) => item.proyectoId.toString()}
        renderItem={renderProyecto}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes proyectos activos aún. ¡Crea uno!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  welcome: { fontSize: 22, fontWeight: '700', color: '#111827' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 16 },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  progressText: { fontSize: 14, color: '#6B7280' },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: '500' },
  badgeOwner: { backgroundColor: '#EEF2F6', color: '#4F46E5' },
  badgeCollab: { backgroundColor: '#ECFDF5', color: '#059669' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 }
});