import api from './api';

export const getProyectos = () => api.get('/proyectos');

export const getProyecto = (id) => api.get(`/proyectos/${id}`);

export const crearProyecto = (datos) => api.post('/proyectos', datos);

export const actualizarProyecto = (id, datos) => api.patch(`/proyectos/${id}`, datos);

export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);

export const invitarMiembro = (id, email) =>
  api.post(`/proyectos/${id}/miembros`, { email });

export const removerMiembro = (id, miembroId) =>
  api.delete(`/proyectos/${id}/miembros/${miembroId}`);
