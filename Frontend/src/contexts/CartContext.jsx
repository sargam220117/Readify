import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5001/api/cart/${user.id}`);
          setCart(response.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart({ items: [] });
        }
      }
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (book, quantity = 1) => {
    if (user) {
      try {
        const response = await axios.post(`http://localhost:5001/api/cart/${user.id}/add`, {
          bookId: book._id,
          quantity
        });
        setCart(response.data);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      setCart(prev => {
        const itemIndex = prev.items.findIndex(item => item.book._id === book._id);
        const newItems = [...prev.items];
        if (itemIndex > -1) {
          newItems[itemIndex].quantity += quantity;
        } else {
          newItems.push({ book, quantity });
        }
        return { ...prev, items: newItems };
      });
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (user) {
      try {
        const response = await axios.put(`http://localhost:5001/api/cart/${user.id}/update`, {
          bookId,
          quantity
        });
        setCart(response.data);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      setCart(prev => {
        const newItems = prev.items.map(item =>
          item.book._id === bookId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0);
        return { ...prev, items: newItems };
      });
    }
  };

  const removeFromCart = async (bookId) => {
    if (user) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/cart/${user.id}/remove/${bookId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.book._id !== bookId)
      }));
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post('http://localhost:5001/api/coupons/validate', {
        code,
        cartTotal: rawTotal
      });
      setCoupon(response.data);
      setDiscount(response.data.discountAmount);
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (error) {
      setCoupon(null);
      setDiscount(0);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply coupon'
      };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
  };

  const clearCart = () => {
    setCart({ items: [] });
    setCoupon(null);
    setDiscount(0);
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const rawTotal = cart.items.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
  const cartTotal = Math.max(0, rawTotal - discount);

  useEffect(() => {
    if (coupon) {
      let newDiscount = 0;
      if (coupon.discountType === 'percentage') {
        newDiscount = (rawTotal * coupon.discountValue) / 100;
      } else {
        newDiscount = coupon.discountValue;
      }
      setDiscount(Math.min(newDiscount, rawTotal));

      if (coupon.minPurchase && rawTotal < coupon.minPurchase) {
        setCoupon(null);
        setDiscount(0);
      }
    }
  }, [rawTotal, coupon]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartCount,
      cartTotal,
      rawTotal,
      discount,
      coupon,
      applyCoupon,
      removeCoupon,
      clearCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};
