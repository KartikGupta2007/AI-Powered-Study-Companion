/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const StudyContext = createContext();

const STORAGE_KEYS = {
  subjects: 'study_subjects',
  topics: 'study_topics',
  tasks: 'study_tasks',
  revisions: 'study_revisions',
};

const readStorageArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return [];
  }
};

export const StudyProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(() => readStorageArray(STORAGE_KEYS.subjects));
  const [topics, setTopics] = useState(() => readStorageArray(STORAGE_KEYS.topics));
  const [tasks, setTasks] = useState(() => readStorageArray(STORAGE_KEYS.tasks));
  const [revisions, setRevisions] = useState(() => readStorageArray(STORAGE_KEYS.revisions));

  // Save subjects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
    } catch (error) {
      console.error('Failed to save subjects to localStorage:', error);
    }
  }, [subjects]);

  // Save topics to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.topics, JSON.stringify(topics));
    } catch (error) {
      console.error('Failed to save topics to localStorage:', error);
    }
  }, [topics]);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  // Save revisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.revisions, JSON.stringify(revisions));
    } catch (error) {
      console.error('Failed to save revisions to localStorage:', error);
    }
  }, [revisions]);

  const replaceAllData = useCallback((data) => {
    setSubjects(Array.isArray(data?.subjects) ? data.subjects : []);
    setTopics(Array.isArray(data?.topics) ? data.topics : []);
    setTasks(Array.isArray(data?.tasks) ? data.tasks : []);
    setRevisions(Array.isArray(data?.revisions) ? data.revisions : []);
  }, []);

  const clearAllDataState = useCallback(() => {
    setSubjects([]);
    setTopics([]);
    setTasks([]);
    setRevisions([]);
  }, []);

  // Subject actions
  const addSubject = useCallback((subject) => {
    setSubjects((prev) => [...prev, { ...subject, id: Date.now().toString() }]);
  }, []);

  const updateSubject = useCallback((id, subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...subject } : s)));
  }, []);

  const deleteSubject = useCallback((id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
  }, []);

  // Topic actions
  const addTopic = useCallback((topic) => {
    setTopics((prev) => [...prev, { ...topic, id: Date.now().toString() }]);
  }, []);

  const updateTopic = useCallback((id, topic) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...topic } : t)));
  }, []);

  const deleteTopic = useCallback((id) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Task actions
  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now().toString() }]);
  }, []);

  const updateTask = useCallback((id, task) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Revision actions
  const addRevision = useCallback((revision) => {
    setRevisions((prev) => [...prev, { ...revision, id: Date.now().toString() }]);
  }, []);

  const updateRevision = useCallback((id, revision) => {
    setRevisions((prev) => prev.map((r) => (r.id === id ? { ...r, ...revision } : r)));
  }, []);

  const deleteRevision = useCallback((id) => {
    setRevisions((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = {
    subjects,
    topics,
    tasks,
    revisions,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    addTask,
    updateTask,
    deleteTask,
    addRevision,
    updateRevision,
    deleteRevision,
    replaceAllData,
    clearAllDataState,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};
