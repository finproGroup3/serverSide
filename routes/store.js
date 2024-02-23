const express = require('express');
const router = express.Router();
const StoreController = require('../controller/store_controller.js');
const authorize = require('../middleware/authorize');

// Route to get all stores
router.get('/', authorize, StoreController.getAllStores);

router.get('/:storeId',authorize, StoreController.getById);
// Route to edit a store
router.put('/:storeId', authorize, StoreController.editStore);

module.exports = router;
