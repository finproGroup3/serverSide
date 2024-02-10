const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product_controller.js");

// GET all products
router.get("/", ProductController.getAll);

// GET product by ID
router.get("/:id", ProductController.getById);

// POST add new product
router.post("/", ProductController.addProduct);

// PUT edit product
router.put("/:id", ProductController.editProduct);

// DELETE delete product
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
