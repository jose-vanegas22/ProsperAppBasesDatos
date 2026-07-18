import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';

export default function DrawerContent(props) {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {usuario?.primerNombre?.[0]?.toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={styles.nombre}>
          {usuario?.primerNombre} {usuario?.primerApellido}
        </Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.cerrarSesion} onPress={cerrarSesion}>
        <Text style={styles.cerrarSesionTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D2137' },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#1E3A5F' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1E6FBF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLetra: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  nombre: { color: '#fff', fontSize: 16, fontWeight: '600' },
  email: { color: '#8BAFD4', fontSize: 13, marginTop: 2 },
  items: { paddingTop: 8 },
  cerrarSesion: { padding: 20, borderTopWidth: 1, borderTopColor: '#1E3A5F' },
  cerrarSesionTexto: { color: '#FF6B6B', fontSize: 15, fontWeight: '600' },
});
