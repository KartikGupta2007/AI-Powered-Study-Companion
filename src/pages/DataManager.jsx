import { useContext } from 'react';
import { FaDownload, FaUpload, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StudyContext } from '../context/StudyContext';
import { exportDataToFile, importDataFromFile, clearAllData } from '../utils/storageManager';

const DataManager = () => {
  const { subjects, topics, tasks, revisions, replaceAllData, clearAllDataState } = useContext(StudyContext);

  const handleExport = () => {
    const success = exportDataToFile(`study_companion_backup_${new Date().toISOString().split('T')[0]}.json`);
    if (success) {
      toast.success('Data exported successfully!');
    } else {
      toast.error('Failed to export data');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importDataFromFile(file)
      .then((data) => {
        replaceAllData(data);
        toast.success('Data imported successfully!');
      })
      .catch((error) => {
        toast.error(`Import failed: ${error.message}`);
      })
      .finally(() => {
        e.target.value = '';
      });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      const success = clearAllData();
      if (success) {
        clearAllDataState();
        toast.success('All data cleared.');
      } else {
        toast.error('Failed to clear data');
      }
    }
  };

  const stats = {
    subjects: subjects.length,
    topics: topics.length,
    tasks: tasks.length,
    revisions: revisions.length,
    total: subjects.length + topics.length + tasks.length + revisions.length,
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Data Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Storage Statistics */}
        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <FaInfoCircle className="text-blue-500 text-xl" />
            <h2 className="text-2xl font-bold text-slate-800">Storage Statistics</h2>
          </div>
          {stats && (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-slate-700 font-semibold">Subjects:</span>
                <span className="text-blue-600 font-bold text-lg">{stats.subjects}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-slate-700 font-semibold">Topics:</span>
                <span className="text-green-600 font-bold text-lg">{stats.topics}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-slate-700 font-semibold">Tasks:</span>
                <span className="text-orange-600 font-bold text-lg">{stats.tasks}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="text-slate-700 font-semibold">Revisions:</span>
                <span className="text-purple-600 font-bold text-lg">{stats.revisions}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-slate-800 font-bold">Total Items:</span>
                <span className="text-slate-800 font-bold text-lg">{stats.total}</span>
              </div>
            </div>
          )}
        </div>

        {/* Export & Import */}
        <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Backup & Restore</h2>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <FaDownload /> Export Data
            </button>
            <label className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 cursor-pointer">
              <FaUpload /> Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleClearData}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <FaTrash /> Clear All Data
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            <strong>Export:</strong> Download your study data as a JSON file for backup.<br />
            <strong>Import:</strong> Restore data from a previously exported backup file.<br />
            <strong>Clear:</strong> Delete all study data from your browser.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-900 mb-2">About Local Storage</h3>
        <p className="text-blue-800 leading-relaxed">
          Your study data is automatically saved to your browser's local storage. This means your subjects, topics, tasks, and revisions are stored locally on this device and will persist even after closing the browser. 
          We recommend regularly exporting your data as a backup to prevent accidental loss. Local storage typically has a limit of 5-10MB depending on your browser.
        </p>
      </div>
    </div>
  );
};

export default DataManager;
