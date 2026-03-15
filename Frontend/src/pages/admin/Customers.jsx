import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/customers');
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
          Customers<span className="text-amber-600">.</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">View and manage your customer database</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f7f3ec] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f3ec] dark:bg-gray-900/50">
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Customer Info</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Contact</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 font-bold">Joined</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Orders</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Total Spent</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {!loading && filteredCustomers.length > 0 ? filteredCustomers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight block">{user.username}</span>
                        <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">Customer</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs font-bold text-gray-500 tracking-tight">
                        <Mail size={12} className="mr-1.5 text-amber-600" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-xs font-bold text-gray-500 tracking-tight opacity-50">
                        <Phone size={12} className="mr-1.5 text-amber-600" />
                        N/A
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-tight">0</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tighter">₹0</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2.5 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="6" className="px-6 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-sm opacity-50">
                      {loading ? 'Loading customers...' : 'No customers found.'}
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

export default Customers;
