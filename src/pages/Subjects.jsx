import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useSubjects from '../hooks/useSubjects';
import SearchBar from '../components/SearchBar';
import SubjectCard from '../components/SubjectCard';

const subjectSchema = yup.object().shape({
  name: yup.string().required('Subject name is required').min(2),
  description: yup.string().required('Description is required').min(5),
  color: yup.string().required('Color is required'),
});

const topicSchema = yup.object().shape({
  name: yup.string().required('Topic name is required').min(2),
  difficulty: yup.string().required('Difficulty is required'),
  status: yup.string().required('Status is required'),
  notes: yup.string(),
});

const Subjects = () => {
  const { subjects, createSubject, updateSubjectData, deleteSubjectData, createTopic, updateTopicData, deleteTopicData, getTopicsBySubject } = useSubjects();
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);

  const {
    register: registerSubject,
    handleSubmit: handleSubjectSubmit,
    reset: resetSubject,
    setValue: setSubjectValue,
    formState: { errors: subjectErrors },
  } = useForm({
    resolver: yupResolver(subjectSchema),
  });

  const {
    register: registerTopic,
    handleSubmit: handleTopicSubmit,
    reset: resetTopic,
    setValue: setTopicValue,
    formState: { errors: topicErrors },
  } = useForm({
    resolver: yupResolver(topicSchema),
  });

  const onSubjectSubmit = (data) => {
    if (editingSubject) {
      updateSubjectData(editingSubject.id, data);
      toast.success('Subject updated!');
      setEditingSubject(null);
    } else {
      createSubject(data);
      toast.success('Subject created!');
    }
    resetSubject();
    setShowSubjectForm(false);
  };

  const onTopicSubmit = (data) => {
    if (editingTopic) {
      updateTopicData(editingTopic.id, data);
      toast.success('Topic updated!');
      setEditingTopic(null);
    } else {
      createTopic({ ...data, subjectId: selectedSubject?.id });
      toast.success('Topic created!');
    }
    resetTopic();
    setShowTopicForm(false);
  };

  const handleDeleteSubject = (id) => {
    if (confirm('Are you sure?')) {
      deleteSubjectData(id);
      toast.success('Subject deleted!');
      setSelectedSubject(null);
    }
  };

  const handleDeleteTopic = (id) => {
    if (confirm('Are you sure?')) {
      deleteTopicData(id);
      toast.success('Topic deleted!');
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
    // Prefill form with subject values
    setTimeout(() => {
      setSubjectValue('name', subject.name);
      setSubjectValue('description', subject.description);
      setSubjectValue('color', subject.color);
    }, 0);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setShowTopicForm(true);
    // Prefill form with topic values
    setTimeout(() => {
      setTopicValue('name', topic.name);
      setTopicValue('difficulty', topic.difficulty);
      setTopicValue('status', topic.status);
      setTopicValue('notes', topic.notes);
    }, 0);
  };

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredSubjects = subjects.filter((subject) => {
    if (!normalizedQuery) return true;

    const subjectMatches = [subject.name, subject.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery));

    if (subjectMatches) return true;

    return getTopicsBySubject(subject.id).some((topic) =>
      [topic.name, topic.notes, topic.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  });

  const subjectTopics = selectedSubject
    ? getTopicsBySubject(selectedSubject.id).filter((topic) => {
        if (!normalizedQuery) return true;
        return [topic.name, topic.notes, topic.status, topic.difficulty]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      })
    : [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subjects & Topics</h1>
        <p className="text-gray-600 text-sm mt-1">Create and manage your study subjects</p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} placeholder="Search subjects and topics..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subjects Column */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
            <button
              onClick={() => {
                setEditingSubject(null);
                setShowSubjectForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
            >
              + Add Subject
            </button>
          </div>

          {showSubjectForm && (
            <form onSubmit={handleSubjectSubmit(onSubjectSubmit)} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                <input
                  {...registerSubject('name')}
                  placeholder="e.g., Mathematics"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {subjectErrors.name && <p className="text-red-600 text-xs mt-1">{subjectErrors.name.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...registerSubject('description')}
                  placeholder="Describe this subject..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  rows="3"
                />
                {subjectErrors.description && (
                  <p className="text-red-600 text-xs mt-1">{subjectErrors.description.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  {...registerSubject('color')}
                  type="color"
                  className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition">
                  {editingSubject ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubjectForm(false);
                    setEditingSubject(null);
                    resetSubject();
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {filteredSubjects.filter(subject => subject.id !== editingSubject?.id).map((subject) => (
              <div
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className={`cursor-pointer transition-all duration-200 rounded-xl overflow-hidden ${
                  selectedSubject?.id === subject.id
                    ? 'bg-gray-100 border-2 border-gray-400 shadow-sm scale-[1.01]'
                    : 'hover:bg-gray-50'
                }`}
              >
                <SubjectCard
                  subject={subject}
                  onDelete={handleDeleteSubject}
                  onEdit={handleEditSubject}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Topics Column */}
        <div>
          {selectedSubject ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedSubject.name}</h2>
                <button
                  onClick={() => {
                    setEditingTopic(null);
                    setShowTopicForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
                >
                  + Add Topic
                </button>
              </div>

              {showTopicForm && (
                <form onSubmit={handleTopicSubmit(onTopicSubmit)} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
                    <input
                      {...registerTopic('name')}
                      placeholder="e.g., Calculus"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    {topicErrors.name && <p className="text-red-600 text-xs mt-1">{topicErrors.name.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select {...registerTopic('difficulty')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Select difficulty</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    {topicErrors.difficulty && (
                      <p className="text-red-600 text-xs mt-1">{topicErrors.difficulty.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select {...registerTopic('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Select status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Needs Revision">Needs Revision</option>
                    </select>
                    {topicErrors.status && (
                      <p className="text-red-600 text-xs mt-1">{topicErrors.status.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      {...registerTopic('notes')}
                      placeholder="Add your notes..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition">
                      {editingTopic ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTopicForm(false);
                        setEditingTopic(null);
                        resetTopic();
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {subjectTopics.filter(topic => topic.id !== editingTopic?.id).map((topic) => {
                  const difficultyColors = {
                    Easy: 'bg-emerald-100 text-emerald-700',
                    Medium: 'bg-amber-100 text-amber-700',
                    Hard: 'bg-red-100 text-red-700',
                  };

                  const statusColors = {
                    'Not Started': 'bg-gray-100 text-gray-700',
                    'In Progress': 'bg-blue-100 text-blue-700',
                    'Completed': 'bg-emerald-100 text-emerald-700',
                    'Needs Revision': 'bg-amber-100 text-amber-700',
                  };

                  return (
                    <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-base">{topic.name}</h4>
                      </div>
                      {topic.notes && <p className="text-gray-600 text-sm mb-3">{topic.notes}</p>}
                      <div className="flex gap-2 flex-wrap items-center mb-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${difficultyColors[topic.difficulty] || difficultyColors.Easy}`}>
                          {topic.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[topic.status] || statusColors['Not Started']}`}>
                          {topic.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTopic(topic)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500 text-center">Select a subject to view topics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
