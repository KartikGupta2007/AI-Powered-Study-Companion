import { useState, useCallback, useContext } from 'react';
import { StudyContext } from '../context/StudyContext';

const useSubjects = () => {
  const {
    subjects,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
  } = useContext(StudyContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSubject = useCallback(
    (subject) => {
      try {
        setLoading(true);
        addSubject(subject);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [addSubject]
  );

  const updateSubjectData = useCallback(
    (id, subject) => {
      try {
        setLoading(true);
        updateSubject(id, subject);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [updateSubject]
  );

  const deleteSubjectData = useCallback(
    (id) => {
      try {
        setLoading(true);
        deleteSubject(id);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [deleteSubject]
  );

  const createTopic = useCallback(
    (topic) => {
      try {
        setLoading(true);
        addTopic(topic);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [addTopic]
  );

  const updateTopicData = useCallback(
    (id, topic) => {
      try {
        setLoading(true);
        updateTopic(id, topic);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [updateTopic]
  );

  const deleteTopicData = useCallback(
    (id) => {
      try {
        setLoading(true);
        deleteTopic(id);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [deleteTopic]
  );

  const getTopicsBySubject = useCallback(
    (subjectId) => {
      return topics.filter((topic) => topic.subjectId === subjectId);
    },
    [topics]
  );

  return {
    subjects,
    topics,
    loading,
    error,
    createSubject,
    updateSubjectData,
    deleteSubjectData,
    createTopic,
    updateTopicData,
    deleteTopicData,
    getTopicsBySubject,
  };
};

export default useSubjects;
