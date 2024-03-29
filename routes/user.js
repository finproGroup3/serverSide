const express = require("express");
const router = express.Router();
const UserController = require("../controller/user_controller.js");

// GET all users
router.get("/", UserController.getAll);

// GET user by ID
router.get("/:id", UserController.getById);

router.get('/count/all', UserController.countAll);

// POST register new user
router.post("/register", UserController.register);

// POST login user
router.post("/login", UserController.login);

// POST edit user profile
router.put("/:id/edit", UserController.editProfile);

module.exports = router;
