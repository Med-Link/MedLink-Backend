const express = require('express');
const { addOrder, getOrders } = require('../controller/order');
const router = express.Router();


router.post('/order/create', addOrder )
router.get('/order/getOrder', getOrders )


module.exports =router;
