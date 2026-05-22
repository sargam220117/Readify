import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, CheckCircle, Clock, Truck } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={14} />;
      case 'Processing': return <Clock size={14} />;
      case 'Shipped': return <Truck size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
            Orders<span className="text-amber-600">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">Track and manage customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold tracking-tight transition-all shadow-sm hover:shadow-md">
            <span>Export CSV</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold tracking-tight transition-all shadow-lg shadow-amber-600/20 hover:scale-105">
            <Filter size={20} />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer name..."
              className="w-full pl-12 pr-4 py-3 bg-[#f7f3ec] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f3ec] dark:bg-gray-900/50">
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Order ID</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Customer</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Date</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Items</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Status</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-amber-600">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{order.user?.username || 'Guest'}</span>
                      <span className="text-[10px] text-gray-400 font-bold tracking-tight">{order.user?.email || ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500 tracking-tight">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">{order.items.length}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white tracking-tighter text-right">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center space-x-1.5 uppercase tracking-widest shadow-sm border ${
                      order.orderStatus === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800' 
                        : order.orderStatus === 'Processing'
                        ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800'
                        : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800'
                    }`}>
                      {getStatusIcon(order.orderStatus)}
                      <span>{order.orderStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2.5 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-sm opacity-50">
                     No orders found. Backend integration coming soon!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
