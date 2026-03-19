import { useState, useCallback } from 'react';

const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { subjects, loading, error, fetchSubjects, setSubjects };
};

export default useSubjects;
