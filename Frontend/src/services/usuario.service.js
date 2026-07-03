import api from './api';

export const registrar = (datos) => api.post('/users', datos);

export const getMiPerfil = () => api.get('/users/me');

export const actualizarPerfil = (id, datos) => api.patch(`/users/${id}`, datos);
