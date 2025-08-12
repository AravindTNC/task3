const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Product = require('../models/Product');

const router = express.Router();

// Validation middleware
const validateProduct = [
    body('name').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// GET all
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json({ time: req.requestTime, products });
    } catch (err) {
        next(err);
    }
});

// GET by ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

// POST create
router.post('/', validateProduct, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
});

// PUT update
router.put('/:id', validateProduct, async (req, res, next) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
