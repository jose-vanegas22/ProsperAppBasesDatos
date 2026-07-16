import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function ProjectCard({ proyecto, rol, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{proyecto.nombreProyecto}</Text>
        <Text style={[styles.role, rol === 'Dueño' ? styles.roleOwner : styles.roleCollab]}>{rol}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  role: { fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  roleOwner: { backgroundColor: '#EEF2F6', color: '#4F46E5' },
  roleCollab: { backgroundColor: '#ECFDF5', color: '#059669' }
});