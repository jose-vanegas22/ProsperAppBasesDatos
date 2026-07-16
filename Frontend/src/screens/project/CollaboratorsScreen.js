import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import client from '../../api/client';
import { isOwner } from '../../utils/roleGuards';

export default function CollaboratorsScreen({ route }) {
  const { proyectoId, rol } = route.params;
  const [email, setEmail] = useState('');

  const handleAddCollaborator = async () => {
    // RF 15 y 4: Bloqueo por rol
    if (!isOwner(rol)) {
      return Alert.alert('Acceso Denegado', 'Solo el Dueño del proyecto puede invitar colaboradores.');
    }
    
    if (!email) return Alert.alert('Error', 'Ingrese un correo electrónico válido.');

    try {
      await client.post(`/usuario-proyecto`, { proyectoId, email });
      Alert.alert('Éxito', 'Colaborador agregado correctamente.');
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar al colaborador. Verifique que el usuario exista.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitar Colaborador</Text>
      <Text style={styles.subtitle}>Agregue a usuarios registrados usando su correo.</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="correo@ejemplo.com" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
      />
      
      <Button 
        title="Agregar al Proyecto" 
        onPress={handleAddCollaborator} 
        color="#4F46E5" 
        disabled={!isOwner(rol)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 }
});