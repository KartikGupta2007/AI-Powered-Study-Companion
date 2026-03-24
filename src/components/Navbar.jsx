import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine, FaCalendarAlt, FaRobot, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition">
            <FaBook className="text-3xl" />
            <span>StudyCompanion</span>
          </Link>

          <ul className="flex gap-0">
            {[
              { path: '/dashboard', label: 'Dashboard', icon: FaChartLine },
              { path: '/subjects', label: 'Subjects', icon: FaBook },
              { path: '/tasks', label: 'Tasks', icon: FaTasks },
              { path: '/revision', label: 'Revision', icon: FaCalendarAlt },
              { path: '/ai-tools', label: 'AI Tools', icon: FaRobot },
              { path: '/data-manager', label: 'Data', icon: FaCog },
            ].map(({ path, label, icon }) => {
              const IconComponent = icon;
              return (
              <li key={path} className={isActive(path) ? 'border-b-4 border-white' : ''}>
                <Link to={path} className="flex items-center gap-2 px-5 py-3 hover:bg-white/10 transition font-semibold">
                  <IconComponent /> {label}
                </Link>
              </li>
            )})}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
