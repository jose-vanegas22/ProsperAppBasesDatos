import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Asegúrate de importar el servicio que creaste previamente
import projectService from '../services/projects'; 

export default function CreateProjectScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProject = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es obligatorio');
      return;
    }

    try {
      // Usamos el servicio de la API que ya tienes configurado
      await projectService.createProject({
        name,
        description,
      });
      Alert.alert('Éxito', 'Proyecto creado correctamente');
      navigation.goBack(); // Regresa al Dashboard tras crear
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear el proyecto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Proyecto</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Nuevo Sistema de Ventas"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Breve descripción del proyecto..."
        multiline
      />

      <Button title="Crear Proyecto" onPress={handleCreateProject} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
  textArea: { height: 100, textAlignVertical: 'top' },
});