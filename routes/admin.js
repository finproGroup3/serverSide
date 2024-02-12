const express = require("express");
const router = express.Router();
const UserController = require("../controller/admin_controller"); // Perbaikan disini

router.get("/", UserController.getAll);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
