const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET all users
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// POST create user
router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        const saved = await user.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
