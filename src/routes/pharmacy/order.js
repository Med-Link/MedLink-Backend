const express = require('express');
const { getOrders } = require('../../controller/pharmacy/order');
const router = express.Router();


router.get('/pharmacy/getOrder', getOrders )


module.exports =router;
