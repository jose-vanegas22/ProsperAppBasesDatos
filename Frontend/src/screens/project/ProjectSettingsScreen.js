import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import client from '../../api/client';
import { isOwner } from '../../utils/roleGuards';

export default function ProjectSettingsScreen({ route, navigation }) {
  const { proyectoId, rol } = route.params;

  const handleDeleteProject = async () => {
    if (!isOwner(rol)) {
      return Alert.alert('Acceso Denegado', 'Solo el Dueño puede eliminar este proyecto.');
    }

    Alert.alert(
      '¿Eliminar Proyecto?',
      'Esta acción no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await client.delete(`/proyecto/${proyectoId}`);
              Alert.alert('Eliminado', 'El proyecto ha sido eliminado.');
              navigation.navigate('Dashboard');
            } catch (error) {
              Alert.alert('Error', 'Hubo un problema al intentar eliminar el proyecto.');
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes del Proyecto</Text>
      
      <View style={styles.dangerZone}>
        <Text style={styles.warningTitle}>Zona de Peligro</Text>
        <Text style={styles.warningText}>Si eliminas el proyecto, todo su contenido se perderá.</Text>
        <Button 
          title="Eliminar Proyecto" 
          color="#EF4444" 
          onPress={handleDeleteProject} 
          disabled={!isOwner(rol)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
  dangerZone: { marginTop: 20, padding: 16, borderColor: '#EF4444', borderWidth: 1, borderRadius: 8, backgroundColor: '#FEF2F2' },
  warningTitle: { color: '#B91C1C', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  warningText: { color: '#991B1B', fontSize: 14, marginBottom: 15 }
});