import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Users, Settings, Ticket } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Books', path: '/admin/books', icon: BookOpen },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#f7f3ec] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300 z-30">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white">
            Readify<span className="text-amber-600">.</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded-full tracking-widest uppercase">Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold tracking-tight ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              <Icon size={20} strokeWidth={2.5} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <NavLink to="/" className="flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold tracking-tight shadow-sm hover:shadow-md">
          <span>&larr; Exit to Storefront</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
