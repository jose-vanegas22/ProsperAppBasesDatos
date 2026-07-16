import client from './client';

// RF 5: Obtener secciones de un proyecto específico
export async function getProjectSections(proyectoId) {
  const response = await client.get(`/seccion?proyectoId=${proyectoId}`);
  return response.data;
}

// RF 6: Crear una tarea dentro de una sección
export async function createTask(seccionId, datosTarea) {
  // datosTarea: { nombreTarea, descripcionTarea, fechaInicio, fechaLimite, prioridad }
  const response = await client.post(`/tarea`, { seccionId, ...datosTarea });
  return response.data;
}

// RF 7, 11: Mover tarea de sección (la validación de subtareas se realiza aquí y en el Back)
export async function moveTask(tareaId, nuevaSeccionId) {
  const response = await client.patch(`/tarea/${tareaId}/mover`, { seccionId: nuevaSeccionId });
  return response.data;
}

// RF 10: Cambiar estado de una subtarea (Checklist)
export async function toggleSubtask(subtareaId, completada) {
  const response = await client.patch(`/subtarea/${subtareaId}`, { estadoSubtarea: completada });
  return response.data;
}

// RF 9: Agregar contenidos adicionales a la tarea (descripción, fragmento de código, etc.)
export async function addTaskContent(tareaId, tipoContenidoId, descripcionContenido) {
  const response = await client.post(`/contenido`, { tareaId, tipoContenidoId, descripcionContenido });
  return response.data;
}