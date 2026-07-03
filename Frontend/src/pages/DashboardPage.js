import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Dashboard — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  texto: { color: '#999', fontSize: 16 },
});
