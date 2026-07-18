import api from './api';

export const getTareasPorSeccion = (seccionId) =>
  api.get(`/tareas/seccion/${seccionId}`);

export const getTarea = (id) => api.get(`/tareas/${id}`);

export const crearTarea = (datos) => api.post('/tareas', datos);

export const actualizarTarea = (id, datos) => api.patch(`/tareas/${id}`, datos);

export const moverTarea = (id, seccionId) =>
  api.patch(`/tareas/${id}/mover`, { seccionId });

export const eliminarTarea = (id) => api.delete(`/tareas/${id}`);
