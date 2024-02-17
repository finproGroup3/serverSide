const express = require('express');
const router = express.Router();
const PromoController = require('../controller/promo_controller.js');
const authorize = require('../middleware/authorize');

router.get('/', authorize, PromoController.getAll);

// Route to get a promo by ID
router.get('/:id', authorize, PromoController.getById);

// Route to add a new promo (only accessible by admins)
router.post('/', authorize, (req, res, next) => {
    // Check if user is an admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
    // If user is an admin, proceed to PromoController.addPromo
    PromoController.addPromo(req, res, next);
});

// Route to edit an existing promo (only accessible by admins)
router.put('/:id', authorize, (req, res, next) => {
    // Check if user is an admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
    // If user is an admin, proceed to PromoController.editPromo
    PromoController.editPromo(req, res, next);
});

// Route to activate a promo (only accessible by admins)
router.put('/activate/:id', authorize, (req, res, next) => {
    // Check if user is an admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
    // If user is an admin, proceed to PromoController.activatePromo
    PromoController.activatePromo(req, res, next);
});

// Route to deactivate a promo (only accessible by admins)
router.put('/deactivate/:id', authorize, (req, res, next) => {
    // Check if user is an admin
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
    // If user is an admin, proceed to PromoController.deactivatePromo
    PromoController.deactivatePromo(req, res, next);
});

module.exports = router;
