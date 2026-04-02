const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.post('/', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      totalAmount, 
      discountAmount, 
      couponCode, 
      shippingAddress 
    } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      discountAmount,
      couponCode,
      shippingAddress,
      paymentStatus: 'Completed', 
      orderStatus: 'Processing'
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.book');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
