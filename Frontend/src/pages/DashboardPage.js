import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getDashboard } from '../services/dashboard.service';

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

function TarjetaProyecto({ proyecto, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo} numberOfLines={1}>{proyecto.nombreProyecto}</Text>
        <View style={[styles.badgeRol, proyecto.rol === 'creador' && styles.badgeRolCreador]}>
          <Text style={styles.badgeRolTexto}>
            {proyecto.rol === 'creador' ? 'Creador' : 'Colaborador'}
          </Text>
        </View>
      </View>

      <Text style={styles.cardFechas}>
        {formatearFecha(proyecto.fechaInicio)} — {formatearFecha(proyecto.fechaLimite)}
      </Text>

      <View style={styles.barraFondo}>
        <View style={[styles.barraRelleno, { width: `${proyecto.progreso}%` }]} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterTexto}>
          {proyecto.tareasCompletadas}/{proyecto.totalTareas} tareas completadas
        </Text>
        <Text style={styles.cardFooterPorcentaje}>{proyecto.progreso}%</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardPage() {
  const navigation = useNavigation();
  const [dashboard, setDashboard] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargarDashboard = useCallback(async () => {
    try {
      const { data } = await getDashboard();
      setDashboard(data);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo cargar el dashboard');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDashboard().finally(() => setCargando(false));
    }, [cargarDashboard]),
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDashboard();
    setRefrescando(false);
  };

  const irAProyecto = (proyectoId) => {
    navigation.navigate('Proyectos', {
      screen: 'DetalleProyecto',
      params: { proyectoId },
      initial: false,
    });
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0D2137" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contenido}
      data={dashboard?.proyectos ?? []}
      keyExtractor={(item) => String(item.proyectoId)}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#0D2137']} />}
      ListHeaderComponent={
        <View style={styles.resumenFila}>
          <View style={styles.resumenTarjeta}>
            <Text style={styles.resumenNumero}>{dashboard?.resumen?.proyectosActivos ?? 0}</Text>
            <Text style={styles.resumenEtiqueta}>Proyectos activos</Text>
          </View>
          <View style={styles.resumenTarjeta}>
            <Text style={styles.resumenNumero}>{dashboard?.resumen?.tareasPendientes ?? 0}</Text>
            <Text style={styles.resumenEtiqueta}>Tareas pendientes</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>Aún no tienes proyectos.</Text>
          <Text style={styles.vacioSubtexto}>Crea uno en la pestaña Proyectos.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TarjetaProyecto proyecto={item} onPress={() => irAProyecto(item.proyectoId)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  contenido: { padding: 20, paddingBottom: 32, flexGrow: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  resumenFila: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  resumenTarjeta: {
    flex: 1, backgroundColor: '#0D2137', borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center',
  },
  resumenNumero: { color: '#fff', fontSize: 28, fontWeight: '800' },
  resumenEtiqueta: { color: '#8BAFD4', fontSize: 12, marginTop: 4, textAlign: 'center' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitulo: { fontSize: 16, fontWeight: '700', color: '#0D2137', flex: 1, marginRight: 8 },
  badgeRol: { backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  badgeRolCreador: { backgroundColor: '#1E6FBF22' },
  badgeRolTexto: { fontSize: 11, fontWeight: '700', color: '#555' },
  cardFechas: { color: '#888', fontSize: 12, marginTop: 6, marginBottom: 12 },

  barraFondo: { height: 8, borderRadius: 4, backgroundColor: '#EEF1F5', overflow: 'hidden' },
  barraRelleno: { height: 8, borderRadius: 4, backgroundColor: '#1E6FBF' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardFooterTexto: { fontSize: 12, color: '#777' },
  cardFooterPorcentaje: { fontSize: 12, fontWeight: '700', color: '#0D2137' },

  vacio: { alignItems: 'center', marginTop: 60 },
  vacioTexto: { fontSize: 16, fontWeight: '600', color: '#555' },
  vacioSubtexto: { fontSize: 13, color: '#999', marginTop: 4 },
});

