/**
 * Determina si el usuario actual es el creador/dueño original del proyecto.
 * @param {number} currentUserId - ID del usuario autenticado (user.usuarioId)
 * @param {number} ownerId - ID del creador del proyecto (proyecto.usuarioCreadorId)
 */
export function isOwner(currentUserId, ownerId) {
  return currentUserId === ownerId;
}

/**
 * RF 15: El creador puede editar, invitar/eliminar colaboradores, crear/eliminar tareas y borrar el proyecto.
 * RF 16: El colaborador solo puede ver, crear y editar tareas (no eliminar el proyecto ni invitar).
 */
export function canManageProject(currentUserId, ownerId) {
  return isOwner(currentUserId, ownerId);
}

export function canManageTasks(rolEnProyecto) {
  // Si tiene un rol asignado en el proyecto o es dueño, puede interactuar.
  return rolEnProyecto === 'Dueño' || rolEnProyecto === 'Colaborador';
}