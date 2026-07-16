import client from './client';

// RF 9: Agregar contenido a una tarea (código, decisiones, descripciones)
export const addContent = async (tareaId, tipoContenidoId, descripcionContenido) => {
  const response = await client.post('/contenido', { tareaId, tipoContenidoId, descripcionContenido });
  return response.data;
};