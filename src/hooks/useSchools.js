import { useState, useEffect } from 'react';
import { publicAPI } from '../utils/api';

export function useSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicAPI.getSchools();
      setSchools(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  return { schools, loading, error, refetch: fetchSchools };
}

export function useSchool(id) {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicAPI.getSchool(id);
      setSchool(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching school:', err);
    } finally {
      setLoading(false);
    }
  };

  return { school, loading, error, refetch: fetchSchool };
}

