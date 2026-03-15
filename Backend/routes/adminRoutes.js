const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Revenue calculation from all orders
    const allOrders = await Order.find({});
    const revenue = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBooks,
      totalCustomers,
      totalOrders,
      revenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all customers
// @route   GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username email')
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
