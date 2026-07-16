import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects.api';

export const useProjects = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProyectos = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProyectos(data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  return { proyectos, loading, refetch: fetchProyectos };
};