import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}/10 dark:${color}/20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`${color.replace('bg-', 'text-')} dark:text-white`} size={24} strokeWidth={2.5} />
        </div>
        <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
          isPositive 
            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' 
            : 'text-rose-600 bg-rose-50 dark:bg-rose-900/30'
        }`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
