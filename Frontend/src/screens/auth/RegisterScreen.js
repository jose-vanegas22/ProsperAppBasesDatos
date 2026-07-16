import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { validateRegisterForm } from '../../utils/validators';
import { colors, spacing, typography, radius } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    primerNombre: '', primerApellido: '', email: '', contrasena: '', fechaNacimiento: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRegister() {
    setServerError('');
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await register(form);
      navigation.navigate('Login');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput style={styles.input} placeholder="Primer nombre"
        value={form.primerNombre} onChangeText={(v) => updateField('primerNombre', v)} />
      {errors.primerNombre && <Text style={styles.errorText}>{errors.primerNombre}</Text>}

      <TextInput style={styles.input} placeholder="Primer apellido"
        value={form.primerApellido} onChangeText={(v) => updateField('primerApellido', v)} />
      {errors.primerApellido && <Text style={styles.errorText}>{errors.primerApellido}</Text>}

      <TextInput style={styles.input} placeholder="Correo electrónico" autoCapitalize="none" keyboardType="email-address"
        value={form.email} onChangeText={(v) => updateField('email', v)} />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry
        value={form.contrasena} onChangeText={(v) => updateField('contrasena', v)} />
      {errors.contrasena && <Text style={styles.errorText}>{errors.contrasena}</Text>}

      <TextInput style={styles.input} placeholder="Fecha de nacimiento (AAAA-MM-DD)"
        value={form.fechaNacimiento} onChangeText={(v) => updateField('fechaNacimiento', v)} />
      {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarme</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  title: { ...typography.h1, textAlign: 'center', color: colors.primary, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xs,
  },
  errorText: { color: colors.danger, marginBottom: spacing.sm, fontSize: 13 },
  button: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', color: colors.primary, marginTop: spacing.md },
});