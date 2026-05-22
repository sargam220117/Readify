import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ theme, toggleTheme }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Session...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f7f3ec] dark:bg-gray-900 transition-colors duration-300 relative">
      <ScrollToTop />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f3ec] dark:bg-gray-950 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
