const express = require("express");
const { addOrder, getOrders } = require("../controller/order");
const { requireSignin, userMiddleware } = require("../common-middleware");
const multer=require('multer');
const upload=multer({dest:''});
const router = express.Router();

router.post("/order/create", requireSignin, userMiddleware, upload.single('prescription'), addOrder);
router.get("/order/getOrder", getOrders);

module.exports = router;
