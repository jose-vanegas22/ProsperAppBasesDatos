import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal,
  KeyboardAvoidingView, Platform, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTarea, eliminarTarea } from '../../services/tarea.service';
import {
  crearSubtarea, toggleSubtarea, eliminarSubtarea,
} from '../../services/subtarea.service';
import {
  getTiposContenido, crearContenido, eliminarContenido,
} from '../../services/contenido.service';

const PRIORIDADES = [
  { valor: 1, etiqueta: 'Baja', color: '#9CA3AF' },
  { valor: 2, etiqueta: 'Media', color: '#FBBF24' },
  { valor: 3, etiqueta: 'Alta', color: '#F87171' },
];

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

function ModalSubtarea({ visible, onClose, onGuardado, tareaId }) {
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => { if (visible) setDescripcion(''); }, [visible]);

  const guardar = async () => {
    if (!descripcion.trim()) return;
    setGuardando(true);
    try {
      await crearSubtarea({ descripcionSubtarea: descripcion.trim(), tareaId });
      onGuardado();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo crear la subtarea');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalCaja}>
          <Text style={styles.modalTitulo}>Nueva subtarea</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Crear formulario de login"
            placeholderTextColor="#aaa"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <View style={styles.modalBotones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={onClose} disabled={guardando}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonPrimario} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonPrimarioTexto}>Agregar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ModalContenido({ visible, onClose, onGuardado, tareaId, tipos }) {
  const [descripcion, setDescripcion] = useState('');
  const [tipoContenidoId, setTipoContenidoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setDescripcion('');
      setTipoContenidoId(tipos[0]?.tipoContenidoId ?? null);
    }
  }, [visible, tipos]);

  const guardar = async () => {
    if (!descripcion.trim() || !tipoContenidoId) return;
    setGuardando(true);
    try {
      await crearContenido({ descripcionContenido: descripcion.trim(), tipoContenidoId, tareaId });
      onGuardado();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo agregar el contenido');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalCaja}>
          <Text style={styles.modalTitulo}>Nuevo contenido</Text>

          <Text style={styles.etiqueta}>Tipo</Text>
          <View style={styles.coloresFila}>
            {tipos.map((t) => (
              <TouchableOpacity
                key={t.tipoContenidoId}
                style={[styles.chip, tipoContenidoId === t.tipoContenidoId && styles.chipSeleccionado]}
                onPress={() => setTipoContenidoId(t.tipoContenidoId)}
              >
                <Text style={[styles.chipTexto, tipoContenidoId === t.tipoContenidoId && styles.chipTextoSeleccionado]}>
                  {t.nombreTipoContenido}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.etiqueta}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            placeholder="Escribe el contenido..."
            placeholderTextColor="#aaa"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <View style={styles.modalBotones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={onClose} disabled={guardando}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonPrimario} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonPrimarioTexto}>Agregar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function DetalleTareaPage({ route, navigation }) {
  const { tareaId } = route.params;

  const [tarea, setTarea] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalSubtareaVisible, setModalSubtareaVisible] = useState(false);
  const [modalContenidoVisible, setModalContenidoVisible] = useState(false);

  const cargarTarea = useCallback(async () => {
    try {
      const [{ data: t }, { data: tp }] = await Promise.all([
        getTarea(tareaId),
        getTiposContenido(),
      ]);
      setTarea(t);
      setTipos(tp);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo cargar la tarea');
    }
  }, [tareaId]);

  useFocusEffect(
    useCallback(() => {
      cargarTarea().finally(() => setCargando(false));
    }, [cargarTarea]),
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarTarea();
    setRefrescando(false);
  };

  const onToggleSubtarea = async (subtarea) => {
    try {
      await toggleSubtarea(subtarea.subtareaId);
      cargarTarea();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo actualizar la subtarea');
    }
  };

  const confirmarEliminarSubtarea = (subtarea) => {
    Alert.alert('Eliminar subtarea', `¿Eliminar "${subtarea.descripcionSubtarea}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarSubtarea(subtarea.subtareaId);
            cargarTarea();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar la subtarea');
          }
        },
      },
    ]);
  };

  const confirmarEliminarContenido = (contenido) => {
    Alert.alert('Eliminar contenido', '¿Eliminar este contenido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarContenido(contenido.contenidoId);
            cargarTarea();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar el contenido');
          }
        },
      },
    ]);
  };

  const confirmarEliminarTarea = () => {
    Alert.alert('Eliminar tarea', `¿Eliminar "${tarea.nombreTarea}"? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarTarea(tarea.tareaId);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar la tarea');
          }
        },
      },
    ]);
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0D2137" />
      </View>
    );
  }

  if (!tarea) {
    return (
      <View style={styles.centro}>
        <Text style={styles.vacioTexto}>No se pudo cargar la tarea</Text>
      </View>
    );
  }

  const prio = PRIORIDADES.find((p) => p.valor === tarea.prioridad);
  const subtareas = tarea.subtareas ?? [];
  const totalSub = subtareas.length;
  const completadasSub = subtareas.filter((s) => s.estadoSubtarea).length;
  const progreso = totalSub > 0 ? Math.round((completadasSub / totalSub) * 100) : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenido}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#0D2137']} />}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.titulo}>{tarea.nombreTarea}</Text>
          <View style={[styles.badgePrioridad, { backgroundColor: prio?.color ?? '#ccc' }]}>
            <Text style={styles.badgePrioridadTexto}>{prio?.etiqueta ?? '—'}</Text>
          </View>
        </View>
        <Text style={styles.descripcion}>{tarea.descripcionTarea}</Text>
        <Text style={styles.fechas}>
          {formatearFecha(tarea.fechaInicio)} — {formatearFecha(tarea.fechaLimite)}
        </Text>

        {totalSub > 0 && (
          <>
            <View style={styles.barraFondo}>
              <View style={[styles.barraRelleno, { width: `${progreso}%` }]} />
            </View>
            <Text style={styles.progresoTexto}>{completadasSub}/{totalSub} subtareas completadas</Text>
          </>
        )}

        <TouchableOpacity style={styles.botonEliminarTarea} onPress={confirmarEliminarTarea}>
          <Text style={styles.accionBotonTextoPeligro}>Eliminar tarea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.seccionHeader}>
          <Text style={styles.cardTitulo}>Subtareas</Text>
          <TouchableOpacity onPress={() => setModalSubtareaVisible(true)}>
            <Text style={styles.encabezadoAccion}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {subtareas.length === 0 && <Text style={styles.vacioSubtexto}>Sin subtareas aún</Text>}

        {subtareas.map((s) => (
          <View key={s.subtareaId} style={styles.filaSubtarea}>
            <TouchableOpacity style={styles.checkboxFila} onPress={() => onToggleSubtarea(s)}>
              <View style={[styles.checkbox, s.estadoSubtarea && styles.checkboxMarcado]}>
                {s.estadoSubtarea && <Text style={styles.checkboxTilde}>✓</Text>}
              </View>
              <Text style={[styles.filaSubtareaTexto, s.estadoSubtarea && styles.filaSubtareaTextoCompletado]}>
                {s.descripcionSubtarea}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarEliminarSubtarea(s)}>
              <Text style={styles.accionBotonTextoPeligro}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.seccionHeader}>
          <Text style={styles.cardTitulo}>Contenido</Text>
          <TouchableOpacity onPress={() => setModalContenidoVisible(true)}>
            <Text style={styles.encabezadoAccion}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {(tarea.contenidos ?? []).length === 0 && <Text style={styles.vacioSubtexto}>Sin contenido aún</Text>}

        {(tarea.contenidos ?? []).map((c) => (
          <View key={c.contenidoId} style={styles.filaContenido}>
            <View style={styles.filaContenidoHeader}>
              <View style={styles.badgeTipo}>
                <Text style={styles.badgeTipoTexto}>{c.tipoContenido?.nombreTipoContenido}</Text>
              </View>
              <TouchableOpacity onPress={() => confirmarEliminarContenido(c)}>
                <Text style={styles.accionBotonTextoPeligro}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.filaContenidoTexto}>{c.descripcionContenido}</Text>
          </View>
        ))}
      </View>

      <ModalSubtarea
        visible={modalSubtareaVisible}
        tareaId={tareaId}
        onClose={() => setModalSubtareaVisible(false)}
        onGuardado={() => { setModalSubtareaVisible(false); cargarTarea(); }}
      />

      <ModalContenido
        visible={modalContenidoVisible}
        tareaId={tareaId}
        tipos={tipos}
        onClose={() => setModalContenidoVisible(false)}
        onGuardado={() => { setModalContenidoVisible(false); cargarTarea(); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  contenido: { padding: 20, paddingBottom: 40 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  vacioTexto: { fontSize: 16, fontWeight: '600', color: '#555' },
  vacioSubtexto: { fontSize: 13, color: '#999', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#0D2137' },
  titulo: { fontSize: 18, fontWeight: '700', color: '#0D2137', flex: 1, marginRight: 8 },
  descripcion: { fontSize: 14, color: '#444', marginTop: 10, lineHeight: 20 },
  fechas: { fontSize: 12, color: '#888', marginTop: 10 },

  badgePrioridad: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  badgePrioridadTexto: { fontSize: 11, fontWeight: '700', color: '#1a1a1a' },

  barraFondo: { height: 8, borderRadius: 4, backgroundColor: '#EEF1F5', overflow: 'hidden', marginTop: 14 },
  barraRelleno: { height: 8, borderRadius: 4, backgroundColor: '#1E6FBF' },
  progresoTexto: { fontSize: 12, color: '#777', marginTop: 6 },

  botonEliminarTarea: { marginTop: 16, alignSelf: 'flex-start' },

  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  encabezadoAccion: { color: '#1E6FBF', fontSize: 13, fontWeight: '700' },

  filaSubtarea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  checkboxFila: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  checkboxMarcado: { backgroundColor: '#1E6FBF', borderColor: '#1E6FBF' },
  checkboxTilde: { color: '#fff', fontSize: 13, fontWeight: '700' },
  filaSubtareaTexto: { fontSize: 14, color: '#1a1a1a', flex: 1 },
  filaSubtareaTextoCompletado: { color: '#aaa', textDecorationLine: 'line-through' },

  filaContenido: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  filaContenidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  filaContenidoTexto: { fontSize: 14, color: '#333', lineHeight: 19 },
  badgeTipo: { backgroundColor: '#1E6FBF22', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  badgeTipoTexto: { fontSize: 11, fontWeight: '700', color: '#1E6FBF' },

  accionBotonTextoPeligro: { fontSize: 13, fontWeight: '600', color: '#FF6B6B' },

  modalFondo: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCaja: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#0D2137', marginBottom: 18 },
  etiqueta: { fontSize: 13, color: '#555', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 13, marginBottom: 14, fontSize: 15, color: '#1a1a1a' },
  inputMultilinea: { minHeight: 90, textAlignVertical: 'top' },
  modalBotones: { flexDirection: 'row', gap: 12, marginTop: 8 },
  botonSecundario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0F2F5' },
  botonSecundarioTexto: { color: '#555', fontWeight: '600' },
  botonPrimario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#0D2137' },
  botonPrimarioTexto: { color: '#fff', fontWeight: '700' },

  coloresFila: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F0F2F5' },
  chipSeleccionado: { backgroundColor: '#0D2137' },
  chipTexto: { fontSize: 12, fontWeight: '600', color: '#555' },
  chipTextoSeleccionado: { color: '#fff' },
});