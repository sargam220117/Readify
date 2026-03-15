import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight, BookOpen } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fcfaf7] dark:bg-gray-900 px-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-full mb-8 shadow-sm">
          <Heart size={64} className="text-gray-200 dark:text-gray-700" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tighter">Your wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">Save books you love to your wishlist and they'll show up here.</p>
        <Link to="/shop" className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-10 py-4 font-bold hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-xl hover:-translate-y-1">
          Explore Books
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf7] dark:bg-gray-900 min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
            <Heart size={32} className="text-amber-600 fill-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
            My Wishlist<span className="text-amber-600">.</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((book) => (
            <div key={book._id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group relative">
              <div className="h-48 bg-amber-50 dark:bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                    src={book.imageUrl} 
                    alt={book.title} 
                    className="h-full object-cover rounded shadow-md group-hover:scale-110 transition-transform duration-500 z-10" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-amber-100 text-amber-600 dark:bg-amber-900/30 uppercase tracking-widest">{book.genre}</span>
                    <button 
                        onClick={() => toggleWishlist(book)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove from wishlist"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">{book.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">by {book.author}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
                  <span className="text-2xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">₹{book.price}</span>
                  <button 
                    onClick={() => {
                        addToCart(book);
                        toggleWishlist(book); // Move to cart means remove from wishlist
                    }}
                    className="bg-[#1a1a1a] dark:bg-amber-600 text-white p-3 rounded-xl hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-lg shadow-black/5 active:scale-90"
                    title="Move to Cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
