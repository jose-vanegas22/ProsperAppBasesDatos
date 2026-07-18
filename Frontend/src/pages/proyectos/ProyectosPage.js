import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
  Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getProyectos, crearProyecto, actualizarProyecto, eliminarProyecto,
} from '../../services/proyecto.service';

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

function ModalProyecto({ visible, proyecto, onClose, onGuardado }) {
  const esEdicion = !!proyecto;
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setNombreProyecto(proyecto?.nombreProyecto ?? '');
      setFechaInicio(proyecto?.fechaInicio?.slice(0, 10) ?? hoyISO());
      setFechaLimite(proyecto?.fechaLimite?.slice(0, 10) ?? '');
    }
  }, [visible, proyecto]);

  const guardar = async () => {
    if (!nombreProyecto.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es obligatorio');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
      Alert.alert('Error', 'La fecha de inicio debe tener formato AAAA-MM-DD');
      return;
    }
    if (fechaLimite && !/^\d{4}-\d{2}-\d{2}$/.test(fechaLimite)) {
      Alert.alert('Error', 'La fecha límite debe tener formato AAAA-MM-DD');
      return;
    }

    const datos = {
      nombreProyecto: nombreProyecto.trim(),
      fechaInicio,
      ...(fechaLimite && { fechaLimite }),
    };

    setGuardando(true);
    try {
      if (esEdicion) {
        await actualizarProyecto(proyecto.proyectoId, datos);
      } else {
        await crearProyecto(datos);
      }
      onGuardado();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo guardar el proyecto');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalFondo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.modalCaja} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitulo}>
            {esEdicion ? 'Editar proyecto' : 'Nuevo proyecto'}
          </Text>

          <Text style={styles.etiqueta}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. App de finanzas"
            placeholderTextColor="#aaa"
            value={nombreProyecto}
            onChangeText={setNombreProyecto}
            maxLength={100}
          />

          <Text style={styles.etiqueta}>Fecha de inicio (AAAA-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-01-01"
            placeholderTextColor="#aaa"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />

          <Text style={styles.etiqueta}>Fecha límite (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-06-30"
            placeholderTextColor="#aaa"
            value={fechaLimite}
            onChangeText={setFechaLimite}
          />

          <View style={styles.modalBotones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={onClose} disabled={guardando}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonPrimario} onPress={guardar} disabled={guardando}>
              {guardando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.botonPrimarioTexto}>Guardar</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ProyectosPage({ navigation }) {
  const { usuario } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [proyectoEditar, setProyectoEditar] = useState(null);

  const cargarProyectos = useCallback(async () => {
    try {
      const { data } = await getProyectos();
      setProyectos(data);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudieron cargar los proyectos');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarProyectos().finally(() => setCargando(false));
    }, [cargarProyectos]),
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarProyectos();
    setRefrescando(false);
  };

  const abrirCrear = () => {
    setProyectoEditar(null);
    setModalVisible(true);
  };

  const abrirEditar = (proyecto) => {
    setProyectoEditar(proyecto);
    setModalVisible(true);
  };

  const onGuardado = () => {
    setModalVisible(false);
    cargarProyectos();
  };

  const confirmarEliminar = (proyecto) => {
    Alert.alert(
      'Eliminar proyecto',
      `¿Seguro que quieres eliminar "${proyecto.nombreProyecto}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarProyecto(proyecto.proyectoId);
              cargarProyectos();
            } catch (e) {
              Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar el proyecto');
            }
          },
        },
      ],
    );
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0D2137" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contenido}
        data={proyectos}
        keyExtractor={(item) => String(item.proyectoId)}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#0D2137']} />}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioTexto}>Aún no tienes proyectos</Text>
            <Text style={styles.vacioSubtexto}>Toca "+ Nuevo proyecto" para crear el primero</Text>
          </View>
        }
        renderItem={({ item }) => {
          const esCreador = item.usuarioCreadorId === usuario?.usuarioId;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('DetalleProyecto', {
                proyectoId: item.proyectoId,
                nombreProyecto: item.nombreProyecto,
              })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo} numberOfLines={1}>{item.nombreProyecto}</Text>
                {esCreador && (
                  <View style={styles.badgeCreador}>
                    <Text style={styles.badgeCreadorTexto}>Creador</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardFechas}>
                {formatearFecha(item.fechaInicio)} — {formatearFecha(item.fechaLimite)}
              </Text>

              {esCreador && (
                <View style={styles.cardAcciones}>
                  <TouchableOpacity style={styles.accionBoton} onPress={() => abrirEditar(item)}>
                    <Text style={styles.accionBotonTexto}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.accionBoton} onPress={() => confirmarEliminar(item)}>
                    <Text style={[styles.accionBotonTexto, styles.accionBotonTextoPeligro]}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={abrirCrear}>
        <Text style={styles.fabTexto}>+ Nuevo proyecto</Text>
      </TouchableOpacity>

      <ModalProyecto
        visible={modalVisible}
        proyecto={proyectoEditar}
        onClose={() => setModalVisible(false)}
        onGuardado={onGuardado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  contenido: { padding: 20, paddingBottom: 100, flexGrow: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitulo: { fontSize: 16, fontWeight: '700', color: '#0D2137', flex: 1, marginRight: 8 },
  cardFechas: { color: '#888', fontSize: 12, marginTop: 6 },

  badgeCreador: { backgroundColor: '#1E6FBF22', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  badgeCreadorTexto: { fontSize: 11, fontWeight: '700', color: '#1E6FBF' },

  cardAcciones: { flexDirection: 'row', gap: 16, marginTop: 12, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  accionBoton: { paddingVertical: 2 },
  accionBotonTexto: { fontSize: 13, fontWeight: '600', color: '#0D2137' },
  accionBotonTextoPeligro: { color: '#FF6B6B' },

  vacio: { alignItems: 'center', marginTop: 60 },
  vacioTexto: { fontSize: 16, fontWeight: '600', color: '#555' },
  vacioSubtexto: { fontSize: 13, color: '#999', marginTop: 4, textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 24, left: 20, right: 20,
    backgroundColor: '#0D2137', borderRadius: 12, paddingVertical: 15, alignItems: 'center',
  },
  fabTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },

  modalFondo: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCaja: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#0D2137', marginBottom: 18 },
  etiqueta: { fontSize: 13, color: '#555', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 13, marginBottom: 14, fontSize: 15, color: '#1a1a1a' },
  modalBotones: { flexDirection: 'row', gap: 12, marginTop: 8 },
  botonSecundario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0F2F5' },
  botonSecundarioTexto: { color: '#555', fontWeight: '600' },
  botonPrimario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#0D2137' },
  botonPrimarioTexto: { color: '#fff', fontWeight: '700' },
});

