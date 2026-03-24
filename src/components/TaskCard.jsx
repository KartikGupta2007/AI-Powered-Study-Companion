import React from 'react';
import { FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const TaskCard = ({ task, onDelete, onEdit, onComplete }) => {
  const getStatusBadgeColor = (status) => {
    const colors = {
      Pending: 'bg-gray-100 text-gray-700',
      Completed: 'bg-emerald-100 text-emerald-700',
      Revision: 'bg-blue-100 text-blue-700',
      Overdue: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-amber-100 text-amber-700',
      Low: 'bg-emerald-100 text-emerald-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 m-0 mb-1">{task?.title}</h4>
          <p className="text-sm text-gray-600 m-0">{task?.topic}</p>
        </div>
        <div className="flex gap-1 shrink-0 ml-4">
          {task?.status !== 'Completed' && (
            <button 
              onClick={() => onComplete?.(task?.id)} 
              className="text-gray-400 hover:text-emerald-600 transition p-2" 
              title="Mark Complete"
            >
              <FaCheckCircle size={16} />
            </button>
          )}
          <button 
            onClick={() => onEdit?.(task)} 
            className="text-gray-400 hover:text-blue-600 transition p-2" 
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button 
            onClick={() => onDelete?.(task?.id)} 
            className="text-gray-400 hover:text-red-600 transition p-2" 
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap mt-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeColor(task?.priority)}`}>
          {task?.priority}
        </span>
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(task?.status)}`}>
          {task?.status}
        </span>
        {task?.deadline && (
          <span className="text-xs text-gray-500 ml-auto">
            Due: {formatDistanceToNow(new Date(task?.deadline), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
