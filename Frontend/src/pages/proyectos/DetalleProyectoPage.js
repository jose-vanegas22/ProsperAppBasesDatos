import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal,
  KeyboardAvoidingView, Platform, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getProyecto, invitarMiembro, removerMiembro } from '../../services/proyecto.service';
import {
  getSecciones, crearSeccion, eliminarSeccion,
} from '../../services/seccion.service';
import {
  getTareasPorSeccion, crearTarea, moverTarea, eliminarTarea,
} from '../../services/tarea.service';

const COLORES_SECCION = ['#9CA3AF', '#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#A78BFA'];
const PRIORIDADES = [
  { valor: 1, etiqueta: 'Baja', color: '#9CA3AF' },
  { valor: 2, etiqueta: 'Media', color: '#FBBF24' },
  { valor: 3, etiqueta: 'Alta', color: '#F87171' },
];
const hoyISO = () => new Date().toISOString().slice(0, 10);

function ModalSeccion({ visible, onClose, onGuardado, proyectoId }) {
  const [nombreSeccion, setNombreSeccion] = useState('');
  const [color, setColor] = useState(COLORES_SECCION[0]);
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (visible) { setNombreSeccion(''); setColor(COLORES_SECCION[0]); }
  }, [visible]);

  const guardar = async () => {
    if (!nombreSeccion.trim()) {
      Alert.alert('Error', 'El nombre de la sección es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      await crearSeccion(proyectoId, { nombreSeccion: nombreSeccion.trim(), color });
      onGuardado();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo crear la sección');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.modalCaja} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitulo}>Nueva sección</Text>
          <Text style={styles.etiqueta}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Backlog"
            placeholderTextColor="#aaa"
            value={nombreSeccion}
            onChangeText={setNombreSeccion}
            maxLength={50}
          />
          <Text style={styles.etiqueta}>Color</Text>
          <View style={styles.coloresFila}>
            {COLORES_SECCION.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorSwatch, { backgroundColor: c }, color === c && styles.colorSwatchSeleccionado]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
          <View style={styles.modalBotones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={onClose} disabled={guardando}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonPrimario} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonPrimarioTexto}>Crear</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ModalTarea({ visible, onClose, onGuardado, seccionId }) {
  const [nombreTarea, setNombreTarea] = useState('');
  const [descripcionTarea, setDescripcionTarea] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [prioridad, setPrioridad] = useState(2);
  const [guardando, setGuardando] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setNombreTarea(''); setDescripcionTarea('');
      setFechaInicio(hoyISO()); setFechaLimite(''); setPrioridad(2);
    }
  }, [visible]);

  const guardar = async () => {
    if (!nombreTarea.trim() || !descripcionTarea.trim()) {
      Alert.alert('Error', 'El nombre y la descripción son obligatorios');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fechaLimite)) {
      Alert.alert('Error', 'Las fechas deben tener formato AAAA-MM-DD');
      return;
    }
    setGuardando(true);
    try {
      await crearTarea({
        nombreTarea: nombreTarea.trim(),
        descripcionTarea: descripcionTarea.trim(),
        fechaInicio, fechaLimite, prioridad, seccionId,
      });
      onGuardado();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo crear la tarea');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.modalCaja} contentContainerStyle={{ paddingBottom: 8 }}>
          <Text style={styles.modalTitulo}>Nueva tarea</Text>

          <Text style={styles.etiqueta}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Ej. Implementar login" placeholderTextColor="#aaa"
            value={nombreTarea} onChangeText={setNombreTarea} maxLength={150} />

          <Text style={styles.etiqueta}>Descripción (historia de usuario)</Text>
          <TextInput style={[styles.input, styles.inputMultilinea]} placeholder="Como usuario quiero..." placeholderTextColor="#aaa"
            value={descripcionTarea} onChangeText={setDescripcionTarea} multiline />

          <Text style={styles.etiqueta}>Fecha de inicio (AAAA-MM-DD)</Text>
          <TextInput style={styles.input} placeholder="2026-01-01" placeholderTextColor="#aaa"
            value={fechaInicio} onChangeText={setFechaInicio} />

          <Text style={styles.etiqueta}>Fecha límite (AAAA-MM-DD)</Text>
          <TextInput style={styles.input} placeholder="2026-02-01" placeholderTextColor="#aaa"
            value={fechaLimite} onChangeText={setFechaLimite} />

          <Text style={styles.etiqueta}>Prioridad</Text>
          <View style={styles.coloresFila}>
            {PRIORIDADES.map((p) => (
              <TouchableOpacity
                key={p.valor}
                style={[styles.chip, prioridad === p.valor && { backgroundColor: p.color }]}
                onPress={() => setPrioridad(p.valor)}
              >
                <Text style={[styles.chipTexto, prioridad === p.valor && styles.chipTextoSeleccionado]}>{p.etiqueta}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalBotones}>
            <TouchableOpacity style={styles.botonSecundario} onPress={onClose} disabled={guardando}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonPrimario} onPress={guardar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonPrimarioTexto}>Crear</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ModalMover({ visible, onClose, secciones, seccionActualId, onMover }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalFondo}>
        <ScrollView style={styles.modalCaja} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitulo}>Mover a...</Text>
          {secciones.filter((s) => s.seccionId !== seccionActualId).map((s) => (
            <TouchableOpacity key={s.seccionId} style={styles.opcionMover} onPress={() => onMover(s.seccionId)}>
              <View style={[styles.colorPunto, { backgroundColor: s.color }]} />
              <Text style={styles.opcionMoverTexto}>{s.nombreSeccion}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.botonSecundario, { marginTop: 12 }]} onPress={onClose}>
            <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

function ModalMiembros({ visible, onClose, proyecto, esCreador, onCambio }) {
  const [email, setEmail] = useState('');
  const [invitando, setInvitando] = useState(false);

  const invitar = async () => {
    if (!email.trim()) return;
    setInvitando(true);
    try {
      await invitarMiembro(proyecto.proyectoId, email.trim());
      setEmail('');
      onCambio();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo invitar al usuario');
    } finally {
      setInvitando(false);
    }
  };

  const remover = (miembro) => {
    Alert.alert('Remover miembro', `¿Remover a ${miembro.usuario.primerNombre} del proyecto?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          try {
            await removerMiembro(proyecto.proyectoId, miembro.usuario.usuarioId);
            onCambio();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo remover al miembro');
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalFondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.modalCaja} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitulo}>Miembros del proyecto</Text>

          {proyecto?.miembros?.length ? proyecto.miembros.map((m) => (
            <View key={m.usuario.usuarioId} style={styles.filaMiembro}>
              <Text style={styles.filaMiembroTexto}>
                {m.usuario.primerNombre} {m.usuario.primerApellido} · {m.usuario.email}
              </Text>
              {esCreador && (
                <TouchableOpacity onPress={() => remover(m)}>
                  <Text style={styles.accionBotonTextoPeligro}>Quitar</Text>
                </TouchableOpacity>
              )}
            </View>
          )) : <Text style={styles.vacioSubtexto}>Sin colaboradores aún</Text>}

          {esCreador && (
            <>
              <Text style={[styles.etiqueta, { marginTop: 16 }]}>Invitar por email</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="none"
              />
              <TouchableOpacity style={styles.botonPrimario} onPress={invitar} disabled={invitando}>
                {invitando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonPrimarioTexto}>Invitar</Text>}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={[styles.botonSecundario, { marginTop: 12 }]} onPress={onClose}>
            <Text style={styles.botonSecundarioTexto}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function DetalleProyectoPage({ route, navigation }) {
  const { proyectoId, nombreProyecto } = route.params;
  const { usuario } = useAuth();

  const [proyecto, setProyecto] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [tareasPorSeccion, setTareasPorSeccion] = useState({});
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const [modalSeccionVisible, setModalSeccionVisible] = useState(false);
  const [seccionParaTarea, setSeccionParaTarea] = useState(null);
  const [tareaParaMover, setTareaParaMover] = useState(null);
  const [modalMiembrosVisible, setModalMiembrosVisible] = useState(false);

  const cargarTodo = useCallback(async () => {
    try {
      const [{ data: proy }, { data: secs }] = await Promise.all([
        getProyecto(proyectoId),
        getSecciones(proyectoId),
      ]);
      setProyecto(proy);
      setSecciones(secs);

      const listas = await Promise.all(secs.map((s) => getTareasPorSeccion(s.seccionId)));
      const mapa = {};
      secs.forEach((s, i) => { mapa[s.seccionId] = listas[i].data; });
      setTareasPorSeccion(mapa);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo cargar el proyecto');
    }
  }, [proyectoId]);

  useFocusEffect(
    useCallback(() => {
      cargarTodo().finally(() => setCargando(false));
    }, [cargarTodo]),
  );

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarTodo();
    setRefrescando(false);
  };

  const esCreador = proyecto?.usuarioCreadorId === usuario?.usuarioId;

  const confirmarEliminarSeccion = (seccion) => {
    if (secciones.length <= 1) {
      Alert.alert('No permitido', 'Un proyecto debe tener al menos una sección');
      return;
    }
    Alert.alert('Eliminar sección', `¿Eliminar la sección "${seccion.nombreSeccion}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarSeccion(proyectoId, seccion.seccionId);
            cargarTodo();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar la sección');
          }
        },
      },
    ]);
  };

  const confirmarEliminarTarea = (tarea) => {
    Alert.alert('Eliminar tarea', `¿Eliminar "${tarea.nombreTarea}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarTarea(tarea.tareaId);
            cargarTodo();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.message ?? 'No se pudo eliminar la tarea');
          }
        },
      },
    ]);
  };

  const moverTareaASeccion = async (nuevaSeccionId) => {
    try {
      await moverTarea(tareaParaMover.tareaId, nuevaSeccionId);
      setTareaParaMover(null);
      cargarTodo();
    } catch (e) {
      setTareaParaMover(null);
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo mover la tarea');
    }
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
      <View style={styles.encabezado}>
        <Text style={styles.encabezadoTitulo} numberOfLines={1}>
          {proyecto?.nombreProyecto ?? nombreProyecto}
        </Text>
        <View style={styles.encabezadoAcciones}>
          <TouchableOpacity onPress={() => setModalMiembrosVisible(true)}>
            <Text style={styles.encabezadoAccion}>Miembros ({proyecto?.miembros?.length ?? 0})</Text>
          </TouchableOpacity>
          {secciones.length < 6 && (
            <TouchableOpacity onPress={() => setModalSeccionVisible(true)}>
              <Text style={styles.encabezadoAccion}>+ Sección</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.tablero}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#0D2137']} />}
      >
        {secciones.map((seccion) => (
          <View key={seccion.seccionId} style={styles.columna}>
            <View style={styles.columnaHeader}>
              <View style={[styles.colorPunto, { backgroundColor: seccion.color }]} />
              <Text style={styles.columnaTitulo} numberOfLines={1}>{seccion.nombreSeccion}</Text>
              <Text style={styles.columnaContador}>{tareasPorSeccion[seccion.seccionId]?.length ?? 0}</Text>
              {secciones.length > 1 && (
                <TouchableOpacity onPress={() => confirmarEliminarSeccion(seccion)}>
                  <Text style={styles.columnaEliminar}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.columnaBody}>
              {(tareasPorSeccion[seccion.seccionId] ?? []).map((tarea) => {
                const prio = PRIORIDADES.find((p) => p.valor === tarea.prioridad);
                return (
                  <TouchableOpacity
                    key={tarea.tareaId}
                    style={styles.tareaCard}
                    activeOpacity={0.75}
                    onPress={() => navigation.navigate('DetalleTarea', { tareaId: tarea.tareaId })}
                  >
                    <Text style={styles.tareaTitulo} numberOfLines={2}>{tarea.nombreTarea}</Text>
                    <View style={styles.tareaFooter}>
                      <View style={[styles.badgePrioridad, { backgroundColor: prio?.color ?? '#ccc' }]}>
                        <Text style={styles.badgePrioridadTexto}>{prio?.etiqueta ?? '—'}</Text>
                      </View>
                      <Text style={styles.tareaFecha}>{tarea.fechaLimite?.slice(0, 10)}</Text>
                    </View>
                    <View style={styles.tareaAcciones}>
                      <TouchableOpacity onPress={() => setTareaParaMover(tarea)}>
                        <Text style={styles.accionBotonTexto}>Mover</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmarEliminarTarea(tarea)}>
                        <Text style={styles.accionBotonTextoPeligro}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.agregarTareaBoton} onPress={() => setSeccionParaTarea(seccion.seccionId)}>
              <Text style={styles.agregarTareaTexto}>+ Tarea</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <ModalSeccion
        visible={modalSeccionVisible}
        proyectoId={proyectoId}
        onClose={() => setModalSeccionVisible(false)}
        onGuardado={() => { setModalSeccionVisible(false); cargarTodo(); }}
      />

      <ModalTarea
        visible={!!seccionParaTarea}
        seccionId={seccionParaTarea}
        onClose={() => setSeccionParaTarea(null)}
        onGuardado={() => { setSeccionParaTarea(null); cargarTodo(); }}
      />

      <ModalMover
        visible={!!tareaParaMover}
        secciones={secciones}
        seccionActualId={tareaParaMover?.seccionId}
        onClose={() => setTareaParaMover(null)}
        onMover={moverTareaASeccion}
      />

      <ModalMiembros
        visible={modalMiembrosVisible}
        proyecto={proyecto}
        esCreador={esCreador}
        onClose={() => setModalMiembrosVisible(false)}
        onCambio={cargarTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  encabezado: {
    backgroundColor: '#0D2137', paddingTop: 16, paddingBottom: 14, paddingHorizontal: 20,
  },
  encabezadoTitulo: { color: '#fff', fontSize: 18, fontWeight: '700' },
  encabezadoAcciones: { flexDirection: 'row', gap: 20, marginTop: 10 },
  encabezadoAccion: { color: '#8BAFD4', fontSize: 13, fontWeight: '600' },

  tablero: { padding: 16, alignItems: 'flex-start' },
  columna: { width: 250, backgroundColor: '#EDF0F4', borderRadius: 14, marginRight: 12, maxHeight: '100%' },
  columnaHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  columnaTitulo: { flex: 1, fontWeight: '700', color: '#0D2137', fontSize: 14 },
  columnaContador: { color: '#888', fontSize: 12, marginRight: 6 },
  columnaEliminar: { color: '#FF6B6B', fontWeight: '700' },
  columnaBody: { paddingHorizontal: 10, maxHeight: 420 },

  colorPunto: { width: 10, height: 10, borderRadius: 5 },

  tareaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  tareaTitulo: { fontWeight: '600', color: '#1a1a1a', fontSize: 13, marginBottom: 8 },
  tareaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgePrioridad: { borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  badgePrioridadTexto: { fontSize: 10, fontWeight: '700', color: '#1a1a1a' },
  tareaFecha: { fontSize: 11, color: '#999' },
  tareaAcciones: { flexDirection: 'row', gap: 16, marginTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8 },

  accionBotonTexto: { fontSize: 12, fontWeight: '600', color: '#0D2137' },
  accionBotonTextoPeligro: { fontSize: 12, fontWeight: '600', color: '#FF6B6B' },

  agregarTareaBoton: { padding: 12, alignItems: 'center' },
  agregarTareaTexto: { color: '#0D2137', fontWeight: '700', fontSize: 13 },

  modalFondo: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalCaja: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '85%' },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#0D2137', marginBottom: 18 },
  etiqueta: { fontSize: 13, color: '#555', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 13, marginBottom: 14, fontSize: 15, color: '#1a1a1a' },
  inputMultilinea: { minHeight: 80, textAlignVertical: 'top' },
  modalBotones: { flexDirection: 'row', gap: 12, marginTop: 8 },
  botonSecundario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0F2F5' },
  botonSecundarioTexto: { color: '#555', fontWeight: '600' },
  botonPrimario: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#0D2137' },
  botonPrimarioTexto: { color: '#fff', fontWeight: '700' },

  coloresFila: { flexDirection: 'row', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  colorSwatchSeleccionado: { borderColor: '#0D2137' },

  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F2F5' },
  chipTexto: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextoSeleccionado: { color: '#1a1a1a' },

  opcionMover: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  opcionMoverTexto: { fontSize: 15, color: '#1a1a1a', fontWeight: '600' },

  filaMiembro: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  filaMiembroTexto: { fontSize: 13, color: '#333', flex: 1, marginRight: 8 },
  vacioSubtexto: { fontSize: 13, color: '#999', marginTop: 4 },
});