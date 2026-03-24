/**
 * localStorage Management Utilities
 */

const STORAGE_KEYS = {
  SUBJECTS: 'study_subjects',
  TOPICS: 'study_topics',
  TASKS: 'study_tasks',
  REVISIONS: 'study_revisions',
};

/**
 * Save data to localStorage
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Export all data as JSON file
 */
export const exportDataToFile = (fileName = 'study_companion_backup.json') => {
  try {
    const allData = {
      subjects: loadFromLocalStorage(STORAGE_KEYS.SUBJECTS) || [],
      topics: loadFromLocalStorage(STORAGE_KEYS.TOPICS) || [],
      tasks: loadFromLocalStorage(STORAGE_KEYS.TASKS) || [],
      revisions: loadFromLocalStorage(STORAGE_KEYS.REVISIONS) || [],
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to export data:', error);
    return false;
  }
};

/**
 * Import data from JSON file
 */
export const importDataFromFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        const isValid =
          Array.isArray(data?.subjects) &&
          Array.isArray(data?.topics) &&
          Array.isArray(data?.tasks) &&
          Array.isArray(data?.revisions);

        if (!isValid) {
          reject(new Error('Invalid backup file format'));
          return;
        }

        resolve({
          subjects: data.subjects,
          topics: data.topics,
          tasks: data.tasks,
          revisions: data.revisions,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Clear all data from localStorage
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  try {
    const subjects = loadFromLocalStorage(STORAGE_KEYS.SUBJECTS) || [];
    const topics = loadFromLocalStorage(STORAGE_KEYS.TOPICS) || [];
    const tasks = loadFromLocalStorage(STORAGE_KEYS.TASKS) || [];
    const revisions = loadFromLocalStorage(STORAGE_KEYS.REVISIONS) || [];

    return {
      subjects: subjects.length,
      topics: topics.length,
      tasks: tasks.length,
      revisions: revisions.length,
      total: subjects.length + topics.length + tasks.length + revisions.length,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return null;
  }
};

export default {
  STORAGE_KEYS,
  saveToLocalStorage,
  loadFromLocalStorage,
  exportDataToFile,
  importDataFromFile,
  clearAllData,
  getStorageStats,
};
