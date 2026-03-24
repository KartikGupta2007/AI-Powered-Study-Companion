import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ProgressChart = ({ data, type = 'bar', title }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (type === 'pie' && data) {
    const pieData = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: Number(value) || 0,
    }));
    const hasPieData = pieData.some((item) => item.value > 0);

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out">
        <h3 className="m-0 mb-6 text-gray-900 font-semibold text-lg">{title || 'Progress Distribution'}</h3>
        {hasPieData ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-400 text-base">
            No data available
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out">
      <h3 className="m-0 mb-6 text-gray-900 font-semibold text-lg">{title || 'Task Progress'}</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Legend wrapperStyle={{ color: '#6b7280' }} />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              activeBar={{ fill: '#2563eb' }}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-400 text-base">
          No data available
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
