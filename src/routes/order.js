const express = require("express");
const { addOrder, getOrders } = require("../controller/order");
const { requireSignin, userMiddleware } = require("../common-middleware");
const router = express.Router();

router.post("/order/create", requireSignin, userMiddleware, addOrder);
router.get("/order/getOrder", getOrders);

module.exports = router;
