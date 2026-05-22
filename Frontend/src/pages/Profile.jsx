import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  User, Mail, Lock, Trash2, BookOpen,
  ShoppingBag, Calendar, AlertTriangle, CheckCircle,
  Edit3, Save, X, Package, TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit form state
  const [editForm, setEditForm] = useState({ username: '', email: '', currentPassword: '', newPassword: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setEditForm({ username: user.username, email: user.email, currentPassword: '', newPassword: '' });
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/orders/user/${user.id}`);
      setOrders(data);
    } catch {
      toast.error('Could not load order history');
    } finally {
      setOrdersLoading(false);
    }
  };

  const totalBooksOwned = orders.reduce((acc, o) =>
    acc + o.items.reduce((a, i) => a + i.quantity, 0), 0
  );
  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'A while ago';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editForm.currentPassword) {
      toast.error('Enter your current password to save changes');
      return;
    }
    setEditLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:5001/api/auth/update/${user.id}`,
        editForm
      );
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...stored, username: data.username, email: data.email }));
      toast.success('Profile updated! Please log in again.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { toast.error('Enter your password to confirm deletion'); return; }
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5001/api/auth/delete/${user.id}`, {
        data: { password: deletePassword }
      });
      toast.success('Account deleted. Goodbye!');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'edit', label: 'Edit Profile', icon: Edit3 },
    { id: 'orders', label: 'Purchase History', icon: Package },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="bg-[#fcfaf7] dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-2xl flex-shrink-0">
              <span className="text-4xl font-black text-white">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                {user?.username}
              </h1>
              <p className="text-amber-100 font-medium mt-1">{user?.email}</p>
              <p className="text-amber-200/80 text-xs font-bold uppercase tracking-widest mt-2">
                Member · {memberSince}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center
                ${activeTab === id
                  ? id === 'danger'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-amber-600 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Books Purchased', value: totalBooksOwned, icon: BookOpen, color: 'amber' },
                { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'blue' },
                { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className={`inline-flex p-2.5 rounded-xl mb-4 bg-${color}-50 dark:bg-${color}-900/20`}>
                    <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders quick list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Recent Purchases</h2>
                <button onClick={() => setActiveTab('orders')} className="text-amber-600 text-xs font-black uppercase tracking-widest hover:text-amber-700">
                  View All →
                </button>
              </div>
              {ordersLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-medium">No purchases yet. Go explore the shop!</div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order._id} className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex -space-x-2 flex-shrink-0">
                        {order.items.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.book?.imageUrl}
                            alt={item.book?.title}
                            className="w-10 h-12 object-cover rounded-lg border-2 border-white dark:border-gray-800 shadow-sm"
                          />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                          {order.items.map(i => i.book?.title).join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={11} className="text-gray-400" />
                          <span className="text-[11px] text-gray-400 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-amber-600 text-sm">₹{order.totalAmount.toLocaleString()}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.orderStatus === 'Processing' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>{order.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EDIT PROFILE TAB */}
        {activeTab === 'edit' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 max-w-xl">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Username</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Change Password (optional)</p>
                <div className="relative mb-4">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="New password"
                    value={editForm.newPassword}
                    onChange={e => setEditForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-amber-100 dark:border-amber-900/30">
                <label className="block text-xs font-black text-amber-600 uppercase tracking-widest mb-2">
                  ⚠ Current Password (required to save)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="password"
                    placeholder="Confirm with your current password"
                    value={editForm.currentPassword}
                    onChange={e => setEditForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={editLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
              >
                {editLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ORDERS / PURCHASE HISTORY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Purchase History
              <span className="ml-3 text-base font-bold text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </h2>
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">No purchases yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-gray-50 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-6 flex-wrap">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                          <Calendar size={13} className="text-amber-600" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Books</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                          <BookOpen size={13} className="text-amber-600" />
                          {order.items.reduce((a, i) => a + i.quantity, 0)} book{order.items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                        <p className="text-sm font-black text-amber-600 mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                      order.orderStatus === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>{order.orderStatus}</span>
                  </div>
                  <div className="p-5 flex gap-3 flex-wrap">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex-1 min-w-[180px]">
                        <img src={item.book?.imageUrl} alt={item.book?.title} className="w-10 h-12 object-cover rounded-lg shadow-sm flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.book?.title}</p>
                          <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} · ₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* DANGER ZONE TAB */}
        {activeTab === 'danger' && (
          <div className="max-w-xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-100 dark:border-red-900/30 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <h2 className="text-xl font-black text-red-600 tracking-tight">Delete Account</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                This action is <strong className="text-red-600">permanent and irreversible</strong>. All your data, orders, and account information will be permanently erased from our servers.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Confirm Deletion</h3>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Enter your password to permanently delete <strong className="text-gray-900 dark:text-white">@{user?.username}</strong>'s account.
            </p>
            <div className="relative mb-6">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deletePassword}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                {deleteLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Trash2 size={16} /> Yes, Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
