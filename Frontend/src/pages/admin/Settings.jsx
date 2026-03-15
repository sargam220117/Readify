import React from 'react';
import { Save, User, Shield, Bell, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
          Settings<span className="text-amber-600">.</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">Manage your store preferences and account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500 font-bold tracking-tight border border-amber-200 dark:border-amber-800 transition-all">
              <User size={18} />
              <span>General</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold tracking-tight hover:bg-white dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
              <Shield size={18} />
              <span>Security</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold tracking-tight hover:bg-white dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold tracking-tight hover:bg-white dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
              <Globe size={18} />
              <span>Store Info</span>
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 transition-all hover:shadow-md">
            <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter border-b border-gray-100 dark:border-gray-700 pb-4">Store Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="Readify Bookstore" 
                  className="w-full px-4 py-3 bg-[#f7f3ec] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-bold tracking-tight text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@readify.com" 
                  className="w-full px-4 py-3 bg-[#f7f3ec] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-bold tracking-tight text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Currency</label>
                <select className="w-full px-4 py-3 bg-[#f7f3ec] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-bold tracking-tight text-gray-900 dark:text-white">
                  <option className="bg-white dark:bg-gray-900">INR (₹)</option>
                  <option className="bg-white dark:bg-gray-900">USD ($)</option>
                  <option className="bg-white dark:bg-gray-900">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold tracking-tight transition-all shadow-lg shadow-amber-600/20 active:scale-95">
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
