import api from './api';

export const login = (email, contrasena) =>
  api.post('/auth/login', { email, contrasena });
