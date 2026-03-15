import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    rawTotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    cartCount, 
    loading 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = React.useState('');
  const [couponStatus, setCouponStatus] = React.useState({ success: null, message: '' });

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const result = await applyCoupon(couponCode);
    setCouponStatus(result);
    if (result.success) setCouponCode('');
    setTimeout(() => setCouponStatus({ success: null, message: '' }), 3000);
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        userId: user.id,
        items: cart.items.map(item => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.book.price
        })),
        totalAmount: cartTotal,
        discountAmount: discount,
        couponCode: coupon?.code || null,
        shippingAddress: {
          fullName: user.username,
          address: '123 Book St', // Placeholder for now
          city: 'Read City',
          state: 'Knowledge',
          zipCode: '123456',
          phone: '9876543210'
        }
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (response.status === 201) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-full mb-8">
          <ShoppingBag size={64} className="text-amber-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tighter">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Looks like you haven't added anything to your collection yet.</p>
        <Link to="/shop" className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-10 py-4 font-bold hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-xl hover:-translate-y-1">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf7] dark:bg-gray-900 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tighter">
          Shopping Cart<span className="text-amber-600">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div key={item.book._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-6 group transition-all hover:shadow-md">
                <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                  <img src={item.book.imageUrl} alt={item.book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">{item.book.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">by {item.book.author}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg bg-[#f9f9f9] dark:bg-gray-700">
                      <button 
                        onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                        className="p-2 text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                        className="p-2 text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.book._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-center sm:items-end">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(item.book.price * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">₹{item.book.price.toLocaleString()} / unit</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Subtotal ({cartCount} items)</span>
                  <span className="font-bold">₹{rawTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-500">
                    <span className="font-medium">Discount ({coupon?.code})</span>
                    <span className="font-bold">- ₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Total</span>
                  <span className="text-2xl font-extrabold text-[#1a1a1a] dark:text-amber-500 tracking-tighter">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-[#fcfaf7] dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Promotional Code</label>
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <div>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">{coupon.code}</span>
                      <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 font-bold uppercase tracking-tight">Applied Successfully</p>
                    </div>
                    <button 
                      onClick={removeCoupon}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-4 py-3 rounded-xl font-bold text-sm hover:bg-amber-600 dark:hover:bg-amber-500 transition-all active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponStatus.message && (
                  <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight px-1 ${couponStatus.success ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponStatus.message}
                  </p>
                )}
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-none font-bold text-lg transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Checkout Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center gap-4 opacity-50 flex-wrap justify-center">
                   <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                   <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                   <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded shadow-sm"></div>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-widest">Secure encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
