import React from 'react';
import { Search, Bell, LogOut, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Topbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-[#f7f3ec] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-20 flex items-center justify-between px-8 z-20 transition-colors duration-300">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search for books, orders, customers..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm font-medium text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow"
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        <div className="relative">
          <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow relative">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-amber-600 border-2 border-[#f7f3ec] dark:border-gray-900 rounded-full animate-pulse"></span>
          </button>
        </div>

        <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-800 pl-6 transition-colors">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{user?.username || 'Admin User'}</span>
             <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Main Store</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 transform hover:scale-105 transition-transform cursor-pointer">
             <User size={22} />
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
