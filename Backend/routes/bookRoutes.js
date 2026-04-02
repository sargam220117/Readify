const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/reviews', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this book' });
      }

      const imageUrls = req.files ? req.files.map(file => `/public/uploads/${file.filename}`) : [];

      const review = {
        user: req.user.id,
        username: req.user.username,
        rating: Number(rating),
        comment,
        images: imageUrls,
      };

      book.reviews.push(review);
      
      book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      const reviewIndex = book.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId.toString()
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (book.reviews[reviewIndex].user.toString() !== req.user.id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this review' });
      }

      book.reviews.splice(reviewIndex, 1);

      if (book.reviews.length > 0) {
        book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;
      } else {
        book.rating = 0;
      }

      await book.save();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, genre, price, stock, imageUrl, description, rating } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl,
      description,
      rating: parseFloat(rating || 0)
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, author, genre, price, stock, imageUrl, description, rating } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.price = price !== undefined ? parseFloat(price) : book.price;
      book.stock = stock !== undefined ? parseInt(stock) : book.stock;
      book.imageUrl = imageUrl || book.imageUrl;
      book.description = description || book.description;
      book.rating = rating !== undefined ? parseFloat(rating) : book.rating;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (book) {
      res.json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
