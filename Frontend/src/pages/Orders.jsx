import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Package, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`https://readify-1-u98x.onrender.com/api/orders/user/${user.id}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 transition-colors duration-300">
        <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-full mb-8">
          <ShoppingBag size={64} className="text-amber-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tighter">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg text-center max-w-md">Your purchase history is empty. Start collecting your favorite books today!</p>
        <Link to="/shop" className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-10 py-4 font-bold hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-xl hover:-translate-y-1">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf7] dark:bg-gray-900 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-amber-600 p-3 rounded-2xl shadow-lg shadow-amber-600/20">
            <Package size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
              My Orders<span className="text-amber-600">.</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Order History & Tracking</p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md group">

              <div className="p-6 sm:p-8 border-b border-gray-50 dark:border-gray-700 flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Placed</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                      <Calendar size={14} className="mr-2 text-amber-600" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-sm font-black text-amber-600 tracking-tight">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 hidden sm:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-sm font-mono text-gray-500 uppercase">#{order._id.slice(-8)}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                      order.orderStatus === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <Link to={`/book/${item.book?._id}`} className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 bg-gray-50 hover:opacity-80 transition-opacity">
                      <img src={item.book.imageUrl} alt={item.book.title} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/book/${item.book?._id}`} className="hover:text-amber-600 transition-colors inline-block">
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{item.book.title}</h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight font-bold">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <Link
                      to={`/book/${item.book?._id}`}
                      className="hidden sm:flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:text-amber-700 transition-colors"
                    >
                      <BookOpen size={14} />
                      View Book
                    </Link>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 px-8 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                <button className="flex items-center gap-2 text-[#1a1a1a] dark:text-gray-300 text-[10px] font-black uppercase tracking-widest hover:text-amber-600 transition-colors group">
                  Order Details
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
