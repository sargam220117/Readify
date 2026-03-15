const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// Get user wishlist
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.params.userId }).populate('book');
    res.json(wishlist.map(item => item.book));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId } = req.body;

    let wishlistItem = await Wishlist.findOne({ user: userId, book: bookId });
    
    if (!wishlistItem) {
      wishlistItem = new Wishlist({ user: userId, book: bookId });
      await wishlistItem.save();
    }

    const updatedWishlist = await Wishlist.find({ user: userId }).populate('book');
    res.json(updatedWishlist.map(item => item.book));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/:userId/remove/:bookId', async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    await Wishlist.findOneAndDelete({ user: userId, book: bookId });
    
    const updatedWishlist = await Wishlist.find({ user: userId }).populate('book');
    res.json(updatedWishlist.map(item => item.book));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
