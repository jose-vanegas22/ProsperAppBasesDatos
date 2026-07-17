import api from './api';

export const getSecciones = (proyectoId) =>
  api.get(`/proyectos/${proyectoId}/secciones`);

export const crearSeccion = (proyectoId, datos) =>
  api.post(`/proyectos/${proyectoId}/secciones`, datos);

export const actualizarSeccion = (proyectoId, id, datos) =>
  api.patch(`/proyectos/${proyectoId}/secciones/${id}`, datos);

export const eliminarSeccion = (proyectoId, id) =>
  api.delete(`/proyectos/${proyectoId}/secciones/${id}`);
