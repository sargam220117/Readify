import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-full mb-8">
        <CheckCircle size={80} className="text-emerald-500" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tighter text-center">
        Payment Successful!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg text-center max-w-md">
        Thank you for your purchase. Your order has been placed successfully and is now being processed.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/orders" 
          className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-3 font-bold hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-lg rounded-xl"
        >
          View Orders
        </Link>
        <Link 
          to="/shop" 
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm rounded-xl"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
