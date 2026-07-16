export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim());
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isValidPassword(password) {
  // Debe alinearse con @MinLength(6) del CreateUserDto en el backend
  return typeof password === 'string' && password.length >= 6;
}

export function isValidDate(dateString) {
  // Backend espera formato ISO (@IsDateString), ej: '1995-08-15'
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString) && !isNaN(Date.parse(dateString));
}

export function maxLength(value, max) {
  return typeof value === 'string' && value.length <= max;
}

// Valida todo el formulario de login y devuelve un objeto de errores
export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isRequired(email)) errors.email = 'El correo es obligatorio';
  else if (!isValidEmail(email)) errors.email = 'Correo inválido';

  if (!isRequired(password)) errors.password = 'La contraseña es obligatoria';

  return errors; // objeto vacío === formulario válido
}

// Valida todo el formulario de registro
export function validateRegisterForm({ primerNombre, primerApellido, email, contrasena, fechaNacimiento }) {
  const errors = {};
  if (!isRequired(primerNombre)) errors.primerNombre = 'El nombre es obligatorio';
  else if (!maxLength(primerNombre, 50)) errors.primerNombre = 'Máximo 50 caracteres';

  if (!isRequired(primerApellido)) errors.primerApellido = 'El apellido es obligatorio';
  else if (!maxLength(primerApellido, 50)) errors.primerApellido = 'Máximo 50 caracteres';

  if (!isRequired(email)) errors.email = 'El correo es obligatorio';
  else if (!isValidEmail(email)) errors.email = 'Correo inválido';

  if (!isRequired(contrasena)) errors.contrasena = 'La contraseña es obligatoria';
  else if (!isValidPassword(contrasena)) errors.contrasena = 'Mínimo 6 caracteres';

  if (!isRequired(fechaNacimiento)) errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  else if (!isValidDate(fechaNacimiento)) errors.fechaNacimiento = 'Formato inválido (AAAA-MM-DD)';

  return errors;
}