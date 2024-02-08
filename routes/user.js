const express = require("express");
const router = express.Router();
const UserController = require("../controller/user_controller.js");

// GET all users
router.get("/", UserController.getAll);

// GET user by ID
router.get("/:id", UserController.getById);

// POST register new user
router.post("/register", UserController.register);

// POST login user
router.post("/login", UserController.login);

module.exports = router;
