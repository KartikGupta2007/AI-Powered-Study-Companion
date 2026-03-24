import { FaCheckCircle, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const RevisionList = ({ revisions, onDelete, onComplete }) => {
  if (!revisions || revisions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="m-0 mb-4 text-gray-900 font-semibold text-lg">Revisions Scheduled</h3>
        <p className="text-center text-gray-400 bg-gray-50 rounded-lg p-6 text-sm">No revisions scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="m-0 mb-6 text-gray-900 font-semibold text-lg">Revisions Scheduled ({revisions.length})</h3>
      <ul className="space-y-2">
        {revisions.map((revision) => (
          <li 
            key={revision?.id} 
            className="relative bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-white hover:shadow-sm transition-all hover:border-gray-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3 flex-1">
                <FaCalendarAlt className="text-gray-400 text-base mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="m-0 text-gray-900 font-medium text-base">{revision?.topic || revision?.title}</h4>
                  <p className="text-gray-500 text-xs m-1.5">
                    {revision?.revisionDate
                      ? format(new Date(revision?.revisionDate), 'PPpp')
                      : 'No date set'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {!revision?.completed && (
                  <button
                    onClick={() => onComplete?.(revision?.id)}
                    className="text-gray-400 hover:text-emerald-600 transition p-2"
                    title="Mark as Completed"
                  >
                    <FaCheckCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(revision?.id)}
                  className="text-gray-400 hover:text-red-600 transition p-2"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
            {revision?.completed && (
              <span className="mt-3 inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-medium">
                ✓ Completed
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevisionList;
