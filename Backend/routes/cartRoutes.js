const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Book = require('../models/Book');

router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId }).populate('items.book');
    if (!cart) {
      cart = await Cart.create({ user: req.params.userId, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:userId/add', async (req, res) => {
  const { bookId, quantity = 1 } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.params.userId }).populate('items.book');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:userId/update', async (req, res) => {
  const { bookId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      const updatedCart = await Cart.findOne({ user: req.params.userId }).populate('items.book');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:userId/remove/:bookId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.book.toString() !== req.params.bookId);
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.params.userId }).populate('items.book');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
