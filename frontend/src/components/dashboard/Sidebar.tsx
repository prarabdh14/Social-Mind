import React from 'react';
import { Home, BarChart2, Settings, LogOut } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { user } = useUser();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.fullName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2A2A72] to-[#4ECDC4] flex items-center justify-center text-white font-medium">
              {user?.fullName?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.fullName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center px-6 py-3 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <Home className="w-5 h-5 mr-3" />
          Overview
        </NavLink>
        <NavLink to="/dashboard/scheduler" className={({ isActive }) => `flex items-center px-6 py-3 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <BarChart2 className="w-5 h-5 mr-3" />
          Scheduler
        </NavLink>
        <NavLink to="/dashboard/analytics" className={({ isActive }) => `flex items-center px-6 py-3 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <BarChart2 className="w-5 h-5 mr-3" />
          Analytics
        </NavLink>
        <NavLink to="/dashboard/review" className={({ isActive }) => `flex items-center px-6 py-3 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <Settings className="w-5 h-5 mr-3" />
          Review Queue
        </NavLink>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;