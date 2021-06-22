const express = require('express');
const { addOrder, getOrders } = require('../controller/order');
const { requireSignin, userMiddleware, uploadS3 } = require('../common-middleware');

const router = express.Router();

router.post('/order/create', requireSignin, userMiddleware, uploadS3.array('prescription'), addOrder);
router.get('/order/getOrder', getOrders);

module.exports = router;
