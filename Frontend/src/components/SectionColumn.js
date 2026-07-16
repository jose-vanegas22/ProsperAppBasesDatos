import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SectionColumn({ seccion, children }) {
  return (
    <View style={styles.column}>
      <View style={[styles.header, { borderLeftColor: seccion.color || '#4F46E5' }]}>
        <Text style={styles.title}>{seccion.nombreSeccion}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { width: 280, backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 8, padding: 12 },
  header: { borderLeftWidth: 4, paddingLeft: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' }
});