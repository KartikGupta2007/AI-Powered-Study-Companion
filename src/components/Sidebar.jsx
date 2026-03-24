import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine, FaCalendarAlt, FaRobot, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/subjects', label: 'Subjects', icon: FaBook },
    { path: '/tasks', label: 'Tasks', icon: FaTasks },
    { path: '/revision', label: 'Revision', icon: FaCalendarAlt },
    { path: '/ai-tools', label: 'AI Tools', icon: FaRobot },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-sm" />
              </div>
              <span className="text-lg">StudyMate</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
          >
            {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
