import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCollaborators = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getUsers');
        
        if (mounted) {
          // Ensure we have an array
          const data = Array.isArray(response.data) ? response.data : [];
          setCollaborators(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch collaborators:', err);
          setError('Failed to fetch collaborators');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCollaborators();

    return () => {
      mounted = false;
    };
  }, []);

  return { collaborators, loading, error };
}