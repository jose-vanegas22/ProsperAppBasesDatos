import client from './client';

// RF 5: Obtener, crear y gestionar secciones personalizadas
export const getProjectSections = async (proyectoId) => {
  const response = await client.get(`/seccion?proyectoId=${proyectoId}`);
  return response.data;
};

export const createSection = async (data) => {
  const response = await client.post('/seccion', data);
  return response.data;
};