import { useState, useEffect } from 'react';
import { FaBook, FaTasks, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import { format } from 'date-fns';
import ProgressChart from '../components/ProgressChart';
import useProgress from '../hooks/useProgress';
import aiService from '../services/aiService';

const Dashboard = () => {
  const { progress } = useProgress();
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [loadingQuote, setLoadingQuote] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoadingQuote(true);
        const motivationalQuote = await aiService.getMotivationalQuote();
        setQuote(motivationalQuote);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setLoadingQuote(false);
      }
    };
    fetchQuote();
  }, []);

  const statsData = [
    {
      icon: <FaTasks />,
      label: 'Total Tasks',
      value: progress?.totalTasks || 0,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <FaCheckCircle />,
      label: 'Completed',
      value: progress?.completedTasks || 0,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: <FaClipboardList />,
      label: 'Pending',
      value: progress?.pendingTasks || 0,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: <FaBook />,
      label: 'Upcoming Revisions',
      value: progress?.revisionTasks || 0,
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Track your study progress and manage your learning</p>
      </div>

      {/* Quote Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition">
        {loadingQuote ? (
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/5 mt-4 animate-pulse"></div>
          </div>
        ) : quote?.quote ? (
          <>
            <blockquote className="m-0 text-base text-gray-700 italic leading-relaxed">
              "{quote.quote}"
            </blockquote>
            <p className="m-0 mt-3 text-sm text-gray-500 font-medium">— {quote.author}</p>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No quote available</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border border-gray-200 rounded-xl p-6 transition hover:shadow-md hover:border-gray-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-2xl ${stat.iconColor} opacity-80`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProgressChart data={progress?.topicsByStatus} type="pie" title="Topic Distribution" />
        <ProgressChart
          data={[
            { name: 'Completed', value: progress?.completedTasks || 0 },
            { name: 'Pending', value: progress?.pendingTasks || 0 },
          ]}
          type="bar"
          title="Task Status"
        />
      </div>

      {/* Weekly Productivity */}
      <div className="mb-8">
        <ProgressChart data={progress?.weeklyProductivity} type="bar" title="Weekly Activity" />
      </div>

      {/* Progress Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Completion</span>
                <span className="text-sm font-bold text-gray-900">{progress?.completionPercentage || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.completionPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Revisions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Revisions</h2>
          {progress?.upcomingRevisions?.length ? (
            <ul className="space-y-3 max-h-48 overflow-y-auto">
              {progress.upcomingRevisions.map((revision) => (
                <li
                  key={revision.id}
                  className="flex items-start justify-between text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{revision.topic}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(revision.revisionDate), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No upcoming revisions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
