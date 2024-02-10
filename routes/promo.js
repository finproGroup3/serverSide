const express = require('express');
const router = express.Router();
const PromoController = require('../controller/promo_controller.js');

// Route to get all promos
router.get('/', PromoController.getAll);

// Route to get a promo by ID
router.get('/:id', PromoController.getById);

// Route to add a new promo
router.post('/', PromoController.addPromo);

// Route to edit an existing promo
router.put('/:id', PromoController.editPromo);

// Route to activate a promo
router.put('/activate/:id', PromoController.activatePromo);

// Route to deactivate a promo
router.put('/deactivate/:id', PromoController.deactivatePromo);

module.exports = router;
