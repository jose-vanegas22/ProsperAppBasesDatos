import api from './api';

export const getTiposContenido = () => api.get('/contenidos/tipos');

export const getContenidos = (tareaId) =>
  api.get(`/contenidos/tarea/${tareaId}`);

export const crearContenido = (datos) => api.post('/contenidos', datos);

export const actualizarContenido = (id, datos) =>
  api.patch(`/contenidos/${id}`, datos);

export const eliminarContenido = (id) => api.delete(`/contenidos/${id}`);
