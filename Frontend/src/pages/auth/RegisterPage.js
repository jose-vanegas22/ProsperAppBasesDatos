import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const hoyMenosAnios = (anios) => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - anios);
  return fecha.toISOString().slice(0, 10);
};

export default function RegisterPage({ navigation }) {
  const { registro } = useAuth();
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!primerNombre.trim() || !primerApellido.trim() || !email.trim() || !contrasena || !fechaNacimiento.trim()) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento.trim())) {
      Alert.alert('Error', 'La fecha de nacimiento debe tener formato AAAA-MM-DD');
      return;
    }

    setCargando(true);
    try {
      await registro({
        primerNombre: primerNombre.trim(),
        ...(segundoNombre.trim() && { segundoNombre: segundoNombre.trim() }),
        primerApellido: primerApellido.trim(),
        ...(segundoApellido.trim() && { segundoApellido: segundoApellido.trim() }),
        email: email.trim(),
        contrasena,
        fechaNacimiento: fechaNacimiento.trim(),
      });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo completar el registro');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Regístrate para empezar a usar ProsperApp</Text>

          <TextInput
            style={styles.input}
            placeholder="Primer nombre *"
            placeholderTextColor="#aaa"
            value={primerNombre}
            onChangeText={setPrimerNombre}
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo nombre"
            placeholderTextColor="#aaa"
            value={segundoNombre}
            onChangeText={setSegundoNombre}
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Primer apellido *"
            placeholderTextColor="#aaa"
            value={primerApellido}
            onChangeText={setPrimerApellido}
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo apellido"
            placeholderTextColor="#aaa"
            value={segundoApellido}
            onChangeText={setSegundoApellido}
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico *"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mín. 6 caracteres) *"
            placeholderTextColor="#aaa"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            textContentType="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (AAAA-MM-DD) *"
            placeholderTextColor="#aaa"
            value={fechaNacimiento}
            onChangeText={setFechaNacimiento}
          />

          <TouchableOpacity style={styles.boton} onPress={handleRegistro} disabled={cargando}>
            {cargando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botonTexto}>Registrarme</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>¿Ya tienes cuenta? <Text style={styles.linkNegrita}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D2137' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#0D2137', textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 15, color: '#1a1a1a' },
  boton: { backgroundColor: '#0D2137', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 18, marginTop: 4 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#666', fontSize: 14 },
  linkNegrita: { color: '#0D2137', fontWeight: '600' },
});
