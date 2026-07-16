import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SubtaskChecklist({ subtarea, onToggle }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.text, subtarea.estadoSubtarea && styles.completed]}>
        {subtarea.descripcionSubtarea}
      </Text>
      <Switch 
        value={subtarea.estadoSubtarea} 
        onValueChange={(val) => onToggle(subtarea.subtareaId, val)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  text: { fontSize: 14, flex: 1, color: '#374151', marginRight: 10 },
  completed: { textDecorationLine: 'line-through', color: '#9CA3AF' }
});