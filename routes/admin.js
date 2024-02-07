// routes/admin.js

const express = require('express');
const router = express.Router();
const { Admin, Promo, Order, Product, User } = require('../models');

// Route to handle admin promos
router.get('/promos', async (req, res) => {
    try {
        const adminPromos = await Admin.findAll({
            include: [Promo]
        });
        res.json(adminPromos);
    } catch (error) {
        console.error('Error fetching admin promos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle admin orders
router.get('/orders', async (req, res) => {
    try {
        const adminOrders = await Admin.findAll({
            include: [Order]
        });
        res.json(adminOrders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle admin products
router.get('/products', async (req, res) => {
    try {
        const adminProducts = await Admin.findAll({
            include: [Product]
        });
        res.json(adminProducts);
    } catch (error) {
        console.error('Error fetching admin products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle admin users
router.get('/users', async (req, res) => {
    try {
        const adminUsers = await Admin.findAll({
            include: [User]
        });
        res.json(adminUsers);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
