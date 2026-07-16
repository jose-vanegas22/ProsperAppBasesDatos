import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContentBlock({ contenido }) {
  return (
    <View style={styles.block}>
      <Text style={styles.type}>
        {contenido.tipoContenido?.nombreTipoContenido || 'Contenido'}
      </Text>
      <Text style={styles.desc}>{contenido.descripcionContenido}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 8 },
  type: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', marginBottom: 4 },
  desc: { fontSize: 14, color: '#1F2937' }
});