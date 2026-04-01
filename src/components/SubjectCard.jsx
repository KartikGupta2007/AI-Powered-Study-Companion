import { FaTrash, FaEdit } from 'react-icons/fa';

const SubjectCard = ({ subject, onDelete, onEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all border-l-4" style={{ borderLeftColor: subject?.color || '#3b82f6' }}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-gray-900 m-0">{subject?.name}</h3>
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit?.(subject)} 
            className="text-gray-400 hover:text-blue-600 transition p-2"
          >
            <FaEdit size={16} />
          </button>
          <button 
            onClick={() => onDelete?.(subject?.id)} 
            className="text-gray-400 hover:text-red-600 transition p-2"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm m-0 leading-relaxed">{subject?.description}</p>
    </div>
  );
};

export default SubjectCard;