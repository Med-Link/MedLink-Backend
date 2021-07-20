const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { addstock } = require('../../controller/pharmacy/stock');

const router = express.Router();

router.post('/pharmacy/addstock', requireSignin, pharmacyMiddleware, addstock);
// router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);

module.exports = router;
