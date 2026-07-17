import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Registro — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  texto: { color: '#999', fontSize: 16 },
});
