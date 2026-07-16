import client from './client';

// RF 10: Marcar subtareas como listas
export const toggleSubtask = async (subtareaId, estadoSubtarea) => {
  const response = await client.patch(`/subtarea/${subtareaId}`, { estadoSubtarea });
  return response.data;
};

export const createSubtask = async (tareaId, descripcionSubtarea) => {
  const response = await client.post('/subtarea', { tareaId, descripcionSubtarea });
  return response.data;
};