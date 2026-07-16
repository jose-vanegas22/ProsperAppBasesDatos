import React from 'react';
import { Text, StyleSheet } from 'react-native';

// RF 8: Prioridad de tareas
export default function PriorityBadge({ prioridad }) {
  const config = {
    1: { label: 'Baja', color: '#10B981', bg: '#D1FAE5' },
    2: { label: 'Media', color: '#F59E0B', bg: '#FEF3C7' },
    3: { label: 'Alta', color: '#EF4444', bg: '#FEE2E2' }
  };
  
  const current = config[prioridad] || config[1];

  return (
    <Text style={[styles.badge, { color: current.color, backgroundColor: current.bg }]}>
      {current.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 8 }
});