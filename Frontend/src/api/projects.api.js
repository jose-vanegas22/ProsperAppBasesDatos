import client from './client';

// RF 12, 13: Obtener proyectos del usuario autenticado
export async function getProjects() {
  const response = await client.get('/proyecto');
  return response.data; // Devuelve un arreglo con el rol e indicador de progreso
}

// RF 3: Crear un nuevo proyecto
export async function createProject(datosProyecto) {
  // datosProyecto: { nombreProyecto, fechaInicio, fechaLimite, secciones: [...] }
  const response = await client.post('/proyecto', datosProyecto);
  return response.data;
}

// RF 4, 15: Agregar colaborador buscando por email
export async function addCollaborator(proyectoId, email) {
  const response = await client.post(`/proyecto/${proyectoId}/colaborador`, { email });
  return response.data;
}

// RF 15: Eliminar el proyecto completo
export async function deleteProject(proyectoId) {
  const response = await client.delete(`/proyecto/${proyectoId}`);
  return response.data;
}