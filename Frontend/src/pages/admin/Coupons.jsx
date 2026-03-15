import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Plus, Trash2, Power, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    expirationDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/coupons');
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/coupons', formData);
      fetchCoupons();
      setShowModal(false);
      toast.success('Coupon created successfully!');
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        expirationDate: '',
        isActive: true
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/coupons/${id}/toggle`);
      setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
      toast.success('Coupon status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await axios.delete(`http://localhost:5000/api/coupons/${id}`);
        setCoupons(coupons.filter(c => c._id !== id));
        toast.success('Coupon deleted');
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
            Coupons<span className="text-amber-600">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">Manage promotional discounts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold tracking-tight transition-all shadow-lg shadow-amber-600/20 hover:scale-105"
        >
          <Plus size={20} />
          <span>Create Coupon</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border ${coupon.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'} shadow-sm transition-all hover:shadow-md relative overflow-hidden group`}>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-amber-50 dark:bg-amber-900/40 p-3 rounded-xl">
                  <Ticket size={24} className="text-amber-600" />
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleToggle(coupon._id)} className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-gray-400 hover:bg-gray-50'}`} title={coupon.isActive ? 'Deactivate' : 'Activate'}>
                    <Power size={18} />
                  </button>
                  <button onClick={() => handleDelete(coupon._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{coupon.code}</h3>
                <p className="text-amber-600 font-bold uppercase text-xs tracking-widest">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-50 dark:border-gray-700">
                <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-tight">
                  <Calendar size={12} className="mr-2" />
                  Expires: {new Date(coupon.expirationDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-tight">
                  <Tag size={12} className="mr-2" />
                  Min Purchase: ₹{coupon.minPurchase}
                </div>
              </div>

              {!coupon.isActive && (
                <div className="absolute top-0 right-0 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">
                  Inactive
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create New Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Coupon Code</label>
                <input 
                  type="text"
                  required
                  placeholder="E.G. SUMMER25"
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white font-bold"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white font-bold appearance-none"
                    value={formData.discountType}
                    onChange={e => setFormData({...formData, discountType: e.target.value})}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Value</label>
                  <input 
                    type="number"
                    required
                    placeholder="20"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white font-bold"
                    value={formData.discountValue}
                    onChange={e => setFormData({...formData, discountValue: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Min Purchase</label>
                  <input 
                    type="number"
                    required
                    placeholder="500"
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white font-bold"
                    value={formData.minPurchase}
                    onChange={e => setFormData({...formData, minPurchase: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Expiration</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white font-bold"
                    value={formData.expirationDate}
                    onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] font-bold rounded-2xl hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default Coupons;
