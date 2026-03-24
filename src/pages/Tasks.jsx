import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useTasks from '../hooks/useTasks';
import useSubjects from '../hooks/useSubjects';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';

const taskSchema = yup.object().shape({
  title: yup.string().required('Task title is required').min(3),
  subject: yup.string().required('Subject is required'),
  topic: yup.string().required('Topic is required'),
  deadline: yup.date().required('Deadline is required'),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
});

const Tasks = () => {
  const { tasks, createTask, updateTaskData, deleteTaskData, getTasksByStatus, getOverdueTasks } = useTasks();
  const { subjects, getTopicsBySubject } = useSubjects();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDeadline, setFilterDeadline] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const selectedSubject = watch('subject');

  const onSubmit = (data) => {
    const normalizedTaskData = {
      ...data,
      completedAt:
        data.status === 'Completed'
          ? editingTask?.completedAt || new Date().toISOString()
          : null,
    };

    if (editingTask) {
      updateTaskData(editingTask.id, normalizedTaskData);
      toast.success('Task updated!');
      setEditingTask(null);
    } else {
      createTask(normalizedTaskData);
      toast.success('Task created!');
    }
    reset();
    setShowForm(false);
  };

  const handleDeleteTask = (id) => {
    if (confirm('Are you sure?')) {
      deleteTaskData(id);
      toast.success('Task deleted!');
    }
  };

  const handleCompleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    updateTaskData(id, { ...task, status: 'Completed', completedAt: new Date().toISOString() });
    toast.success('Task marked as completed!');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
    // Prefill form with task values
    setTimeout(() => {
      setValue('title', task.title);
      setValue('subject', task.subject);
      setValue('topic', task.topic);
      setValue('priority', task.priority);
      setValue('status', task.status);
      // Format deadline for datetime-local input
      if (task.deadline) {
        const date = new Date(task.deadline);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue('deadline', formattedDate);
      }
    }, 0);
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by tab
    if (activeTab === 'Pending') {
      result = getTasksByStatus('Pending');
    } else if (activeTab === 'Completed') {
      result = getTasksByStatus('Completed');
    } else if (activeTab === 'Overdue') {
      result = getOverdueTasks();
    }

    // Filter by search query
    const normalizedQuery = searchQuery.toLowerCase().trim();
    result = result.filter((task) => {
      if (!normalizedQuery) return true;
      return [task.title, task.topic, task.subject, task.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    // Filter by priority
    if (filterPriority !== 'All') {
      result = result.filter((task) => task.priority === filterPriority);
    }

    // Filter by subject
    if (filterSubject !== 'All') {
      result = result.filter((task) => task.subject === filterSubject);
    }

    // Filter by deadline window
    if (filterDeadline !== 'All') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(startOfToday.getDate() + 1);
      const endOfWeek = new Date(startOfToday);
      endOfWeek.setDate(startOfToday.getDate() + 7);

      result = result.filter((task) => {
        if (!task.deadline) return filterDeadline === 'No Deadline';

        const deadlineDate = new Date(task.deadline);
        if (Number.isNaN(deadlineDate.getTime())) return false;

        if (filterDeadline === 'Today') {
          return deadlineDate >= startOfToday && deadlineDate < endOfToday;
        }
        if (filterDeadline === 'This Week') {
          return deadlineDate >= startOfToday && deadlineDate < endOfWeek;
        }
        if (filterDeadline === 'Overdue') {
          return deadlineDate < now && task.status !== 'Completed';
        }

        return true;
      });
    }

    // Sort tasks
    const priorityRank = { High: 0, Medium: 1, Low: 2 };
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
      }

      if (sortBy === 'subject') {
        return (a.subject || '').localeCompare(b.subject || '');
      }

      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
      return aDeadline - bDeadline;
    });

    return result;
  }, [
    tasks,
    activeTab,
    searchQuery,
    filterPriority,
    filterSubject,
    filterDeadline,
    sortBy,
    getTasksByStatus,
    getOverdueTasks,
  ]);

  const tabs = ['All', 'Pending', 'Completed', 'Overdue'];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Study Tasks</h1>
        <p className="text-gray-600 text-sm mt-1">Create, manage, and track your study tasks</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={setSearchQuery} placeholder="Search tasks..." />
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input {...register('title')} placeholder="Task title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input {...register('deadline')} type="datetime-local" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              {errors.deadline && <p className="text-red-600 text-xs mt-1">{errors.deadline.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="text-red-600 text-xs mt-1">{errors.priority.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              {editingTask ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
                reset();
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority:</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject:</label>
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="All">All</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Deadline:</label>
          <select value={filterDeadline} onChange={(e) => setFilterDeadline(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="Overdue">Overdue</option>
            <option value="No Deadline">No Deadline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="deadline">Due Date</option>
            <option value="priority">Priority</option>
            <option value="subject">Subject Name</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-1 py-2 font-medium text-sm transition ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.filter(task => task.id !== editingTask?.id).length > 0 ? (
          filteredTasks.filter(task => task.id !== editingTask?.id).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onComplete={handleCompleteTask}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-64 bg-white border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-400 text-center">No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
