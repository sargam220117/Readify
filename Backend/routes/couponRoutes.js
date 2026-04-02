const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expirationDate: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({ 
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` 
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.min(discountAmount, cartTotal) // Can't discount more than total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
