import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const BookCard = ({ book }) => {
  const { title, author, price, imageUrl, imageColor = 'bg-blue-200' } = book;
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(book._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(book);
    setTimeout(() => setAdding(false), 1000);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className="group cursor-pointer relative transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
    >
      <div className={`w-full aspect-[3/4] ${imageUrl ? '' : imageColor} rounded-md shadow-md mb-4 flex items-center justify-center overflow-hidden shadow-amber-900/10 dark:shadow-none relative`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = ''; e.target.parentElement.className += ` ${imageColor} p-6 text-center`; e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-gray-700 font-serif text-lg font-bold opacity-80 mix-blend-multiply p-6 text-center">
            {title}
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 transform ${isWishlisted
              ? 'bg-red-500 text-white scale-110 shadow-lg'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100'
            }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`opacity-0 group-hover:opacity-100 absolute bottom-4 left-1/2 -translate-x-1/2 ${adding ? 'bg-emerald-600' : 'bg-[#1a1a1a] dark:bg-amber-600'
            } text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xl whitespace-nowrap active:scale-95 flex items-center gap-2`}
        >
          {adding ? (
            <>Added! ✓</>
          ) : (
            <>
              <ShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="text-center w-full">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1 truncate px-2 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate px-2 transition-colors duration-300">{author}</p>
        <p className="text-amber-600 dark:text-amber-500 font-extrabold text-xl transition-colors duration-300 tracking-tighter">₹{price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BookCard;
