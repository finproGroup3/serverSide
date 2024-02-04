const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const adminRouter = require("/admin")

router.use("/users", userRouter);
router.use("/admins", adminRouter);

module.exports = router;
