const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const {incomegrowth} = require('../../controller/pharmacy/dashboard');
const {orderrequestsrate} = require('../../controller/pharmacy/dashboard');
const {monthlyincome} = require('../../controller/pharmacy/dashboard');

const router = express.Router();

router.get('/pharmacy/incomegrowth', requireSignin, pharmacyMiddleware, incomegrowth);
router.get('/pharmacy/orderrequestsrate', requireSignin, pharmacyMiddleware, orderrequestsrate);
router.get('/pharmacy/monthlyincome', requireSignin, pharmacyMiddleware, monthlyincome);

module.exports = router;
