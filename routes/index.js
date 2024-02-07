const express = require("express");
const router = express.Router();
const userRouter = require("./user");
<<<<<<< HEAD
const adminRouter = require("./admin")
=======
const adminRouter = require("/admin")
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c

router.use("/users", userRouter);
router.use("/admins", adminRouter);

module.exports = router;
