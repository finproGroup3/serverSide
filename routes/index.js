const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const adminRouter = require("./admin")
const productRouter = require("./product")
const promoRouter = require("./promo")
const cartRouter = require("./cart")

router.use("/users", userRouter);
router.use("/admins", adminRouter);
router.use("/product", productRouter);
router.use("/promo", promoRouter);
router.use("/cart", cartRouter);

module.exports = router;
