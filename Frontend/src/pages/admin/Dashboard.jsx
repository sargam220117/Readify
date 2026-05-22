import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../../components/admin/StatCard';
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Download,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalBooks: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/stats');
        setStatsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Books', value: statsData.totalBooks.toString(), change: '+100%', icon: BookOpen, color: 'bg-amber-600' },
    { title: 'Total Orders', value: statsData.totalOrders.toString(), change: '0%', icon: ShoppingBag, color: 'bg-blue-600' },
    { title: 'Total Customers', value: statsData.totalCustomers.toString(), change: '+100%', icon: Users, color: 'bg-emerald-600' },
    { title: 'Revenue', value: `₹${statsData.revenue.toLocaleString()}`, change: '+100%', icon: TrendingUp, color: 'bg-rose-600' },
  ];

  const recentOrders = statsData.recentOrders || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
            Dashboard<span className="text-amber-600">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">Welcome back to your bookstore overview</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold tracking-tight transition-all shadow-lg shadow-amber-600/20 hover:scale-105 active:scale-95">
          <Download size={20} />
          <span>Download Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">Recent Orders</h3>
            <button className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center space-x-1 group">
              <span>View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f3ec] dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Customer</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Date</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Amount</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 text-sm font-bold text-amber-600">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{order.user?.username || 'Guest'}</span>
                        <span className="text-[10px] text-gray-400 font-bold tracking-tight">{order.user?.email || ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                        order.orderStatus === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' 
                          : order.orderStatus === 'Processing'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs opacity-50">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 overflow-hidden">
          <h3 className="text-xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter mb-6">Popular Books</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
               <BookOpen size={40} className="text-gray-300 mb-2" />
               <p className="text-sm font-bold text-gray-500">No popular books yet</p>
            </div>
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-600 font-bold tracking-tight hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
