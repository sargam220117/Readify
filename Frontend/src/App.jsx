import React, { useState, useEffect, useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminCoupons from './pages/admin/Coupons';
import AdminSettings from './pages/admin/Settings';
import Login from './pages/admin/Login';
import AdminSignup from './pages/admin/Signup';
import UserLogin from './pages/Login';
import UserSignup from './pages/Signup';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import BookDetails from './pages/BookDetails';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Toaster } from 'react-hot-toast';

function App() {

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      return newTheme;
    });
  };

  const router = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: <StoreLayout theme={theme} toggleTheme={toggleTheme} />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "shop",
          element: <Shop />
        },
        {
          path: "login",
          element: <UserLogin />
        },
        {
          path: "signup",
          element: <UserSignup />
        },
        {
          path: "cart",
          element: <Cart />
        },
        {
          path: "wishlist",
          element: <Wishlist />
        },
        {
          path: "orders",
          element: <Orders />
        },
        {
          path: "book/:id",
          element: <BookDetails />
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminLayout theme={theme} toggleTheme={toggleTheme} />,
      children: [
        {
          index: true,
          element: <AdminDashboard />
        },
        {
          path: "books",
          element: <AdminBooks />
        },
        {
          path: "orders",
          element: <AdminOrders />
        },
        {
          path: "customers",
          element: <AdminCustomers />
        },
        {
          path: "coupons",
          element: <AdminCoupons />
        },
        {
          path: "settings",
          element: <AdminSettings />
        }
      ]
    },
    {
      path: "/admin/login",
      element: <Login />
    },
    {
      path: "/admin/signup",
      element: <AdminSignup />
    }
  ]), [theme, toggleTheme]);

  return (
    <div className="font-sans text-gray-800 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RouterProvider router={router} />
            <Toaster position="bottom-right" />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
