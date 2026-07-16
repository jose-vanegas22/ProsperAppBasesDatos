import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ tarea, onPress, onLongPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.title}>{tarea.nombreTarea}</Text>
      <PriorityBadge prioridad={tarea.prioridad} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 4 },
  title: { fontSize: 14, fontWeight: '600', color: '#374151' }
});