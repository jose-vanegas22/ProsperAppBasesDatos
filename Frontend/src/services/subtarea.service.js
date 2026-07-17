import api from './api';

export const getSubtareas = (tareaId) =>
  api.get(`/subtareas/tarea/${tareaId}`);

export const crearSubtarea = (datos) => api.post('/subtareas', datos);

export const actualizarSubtarea = (id, datos) => api.patch(`/subtareas/${id}`, datos);

export const toggleSubtarea = (id) => api.patch(`/subtareas/${id}/estado`);

export const eliminarSubtarea = (id) => api.delete(`/subtareas/${id}`);
