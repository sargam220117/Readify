const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const allOrders = await Order.find({});
    const revenue = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);

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

router.get('/customers', protect, admin, async (req, res) => {
  try {
    const customers = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders', protect, admin, async (req, res) => {
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
