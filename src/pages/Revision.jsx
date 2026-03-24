import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { StudyContext } from '../context/StudyContext';
import useSubjects from '../hooks/useSubjects';
import RevisionList from '../components/RevisionList';

const revisionSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  topic: yup.string().required('Topic is required'),
  revisionDate: yup.date().required('Revision date is required'),
});

const Revision = () => {
  const { revisions, addRevision, updateRevision: updateRevisionContext, deleteRevision } = useContext(StudyContext);
  const { subjects, getTopicsBySubject } = useSubjects();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(revisionSchema),
  });

  const selectedSubject = watch('subject');

  const onSubmit = (data) => {
    addRevision({
      ...data,
      completed: false,
    });
    toast.success('Revision scheduled!');
    reset();
    setShowForm(false);
  };

  const handleDeleteRevision = (id) => {
    if (confirm('Are you sure?')) {
      deleteRevision(id);
      toast.success('Revision removed!');
    }
  };

  const handleCompleteRevision = (id) => {
    const revision = revisions.find((r) => r.id === id);
    updateRevisionContext(id, { ...revision, completed: true, completedAt: new Date().toISOString() });
    toast.success('Revision completed!');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revision Planner</h1>
        <p className="text-gray-600 text-sm mt-1">Schedule and track revisions for better retention</p>
      </div>

      {/* Spaced Repetition Info */}
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spaced Repetition System</h3>
          <p className="text-gray-600 text-sm mb-4">
            Schedule revisions at optimal intervals to improve retention and long-term memory.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700 text-sm">
              <span className="mr-3 text-gray-400">•</span>
              <span>1 day after completion</span>
            </li>
            <li className="flex items-center text-gray-700 text-sm">
              <span className="mr-3 text-gray-400">•</span>
              <span>3 days after completion</span>
            </li>
            <li className="flex items-center text-gray-700 text-sm">
              <span className="mr-3 text-gray-400">•</span>
              <span>7 days after completion</span>
            </li>
            <li className="flex items-center text-gray-700 text-sm">
              <span className="mr-3 text-gray-400">•</span>
              <span>14 days after completion</span>
            </li>
            <li className="flex items-center text-gray-700 text-sm">
              <span className="mr-3 text-gray-400">•</span>
              <span>30 days after completion</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap"
        >
          {showForm ? '✕ Cancel' : '+ Schedule Revision'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select {...register('subject')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select 
                {...register('topic')} 
                disabled={!selectedSubject}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${!selectedSubject ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              >
                <option value="">Select topic</option>
                {selectedSubject && 
                  getTopicsBySubject(
                    subjects.find((s) => s.name === selectedSubject)?.id
                  )?.map((topic) => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))
                }
              </select>
              {errors.topic && <p className="text-red-600 text-xs mt-1">{errors.topic.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Revision Date</label>
              <input
                {...register('revisionDate')}
                type="datetime-local"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.revisionDate && <p className="text-red-600 text-xs mt-1">{errors.revisionDate.message}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              Schedule Revision
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-8">
        <RevisionList
          revisions={revisions}
          onDelete={handleDeleteRevision}
          onComplete={handleCompleteRevision}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revision Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-3 text-gray-400">•</span>
            <span className="text-gray-700 text-sm">Review completed topics at recommended intervals</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-gray-400">•</span>
            <span className="text-gray-700 text-sm">Make notes of difficult areas during revision</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-gray-400">•</span>
            <span className="text-gray-700 text-sm">Test yourself with practice questions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-gray-400">•</span>
            <span className="text-gray-700 text-sm">Focus on weak areas before examinations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-gray-400">•</span>
            <span className="text-gray-700 text-sm">Maintain a consistent revision schedule</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Revision;
