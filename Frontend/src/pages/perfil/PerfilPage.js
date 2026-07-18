import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { getMiPerfil } from '../../services/usuario.service';

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargarPerfil = useCallback(async () => {
    try {
      const { data } = await getMiPerfil();
      setPerfil(data);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo cargar el perfil');
    }
  }, []);

  useEffect(() => {
    cargarPerfil().finally(() => setCargando(false));
  }, [cargarPerfil]);

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarPerfil();
    setRefrescando(false);
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0D2137" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  const nombreCompleto = [
    perfil.primerNombre, perfil.segundoNombre,
    perfil.primerApellido, perfil.segundoApellido,
  ].filter(Boolean).join(' ');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenido}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={['#0D2137']} />}
    >
      <View style={styles.cabecera}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {perfil.primerNombre?.[0]?.toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={styles.nombre}>{nombreCompleto}</Text>
        <Text style={styles.email}>{perfil.email}</Text>
        {!perfil.activo && (
          <View style={styles.badgeInactivo}>
            <Text style={styles.badgeInactivoTexto}>Cuenta inactiva</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Información personal</Text>

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Primer nombre</Text>
          <Text style={styles.filaValor}>{perfil.primerNombre}</Text>
        </View>
        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Segundo nombre</Text>
          <Text style={styles.filaValor}>{perfil.segundoNombre ?? '—'}</Text>
        </View>
        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Primer apellido</Text>
          <Text style={styles.filaValor}>{perfil.primerApellido}</Text>
        </View>
        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Segundo apellido</Text>
          <Text style={styles.filaValor}>{perfil.segundoApellido ?? '—'}</Text>
        </View>
        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Fecha de nacimiento</Text>
          <Text style={styles.filaValor}>{formatearFecha(perfil.fechaNacimiento)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Cuenta</Text>

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Correo electrónico</Text>
          <Text style={styles.filaValor}>{perfil.email}</Text>
        </View>
        <View style={styles.separador} />

        <View style={styles.fila}>
          <Text style={styles.filaEtiqueta}>Miembro desde</Text>
          <Text style={styles.filaValor}>{formatearFecha(perfil.fechaCreacion)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  contenido: { paddingBottom: 32 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  texto: { color: '#999', fontSize: 16 },

  cabecera: {
    backgroundColor: '#0D2137',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#1E6FBF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLetra: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nombre: { color: '#fff', fontSize: 19, fontWeight: '700', textAlign: 'center' },
  email: { color: '#8BAFD4', fontSize: 14, marginTop: 4 },
  badgeInactivo: {
    marginTop: 12, backgroundColor: '#FF6B6B22',
    borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12,
  },
  badgeInactivoTexto: { color: '#FF6B6B', fontSize: 12, fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#0D2137', marginBottom: 14 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  filaEtiqueta: { color: '#777', fontSize: 14 },
  filaValor: { color: '#1a1a1a', fontSize: 14, fontWeight: '600' },
  separador: { height: 1, backgroundColor: '#eee' },
});
