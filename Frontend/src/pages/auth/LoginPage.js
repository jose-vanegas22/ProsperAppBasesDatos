import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!email || !contrasena) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    setCargando(true);
    try {
      await login(email, contrasena);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Credenciales inválidas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.titulo}>ProsperAPP</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TouchableOpacity style={styles.boton} onPress={handleLogin} disabled={cargando}>
          {cargando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botonTexto}>Iniciar sesión</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta? <Text style={styles.linkNegrita}>Regístrate</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D2137', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  titulo: { fontSize: 30, fontWeight: 'bold', color: '#0D2137', textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 28 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 15, color: '#1a1a1a' },
  boton: { backgroundColor: '#0D2137', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 18 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#666', fontSize: 14 },
  linkNegrita: { color: '#0D2137', fontWeight: '600' },
});
