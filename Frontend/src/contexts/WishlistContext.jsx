import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/wishlist/${user.id}`);
          setWishlist(response.data);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      } else {
        const localWishlist = localStorage.getItem('guestWishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        } else {
          setWishlist([]);
        }
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user]);

  // Guest persistence
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = async (book) => {
    if (user) {
      if (wishlist.some(item => item._id === book._id)) {
        // Remove
        try {
          const response = await axios.delete(`http://localhost:5000/api/wishlist/${user.id}/remove/${book._id}`);
          setWishlist(response.data);
        } catch (error) {
          console.error('Error removing from wishlist:', error);
        }
      } else {
        // Add
        try {
          const response = await axios.post(`http://localhost:5000/api/wishlist/${user.id}/add`, {
            bookId: book._id
          });
          setWishlist(response.data);
        } catch (error) {
          console.error('Error adding to wishlist:', error);
        }
      }
    } else {
      setWishlist(prev => {
        if (prev.some(item => item._id === book._id)) {
          return prev.filter(item => item._id !== book._id);
        } else {
          return [...prev, book];
        }
      });
    }
  };

  const isInWishlist = (bookId) => wishlist.some(item => item._id === bookId);
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};
