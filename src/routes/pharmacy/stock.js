const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { addstock, updatestock } = require('../../controller/pharmacy/stock');

const router = express.Router();

router.post('/pharmacy/addstock', requireSignin, pharmacyMiddleware, addstock);
router.post('/pharmacy/updatestock', requireSignin, pharmacyMiddleware, updatestock);

// router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);

module.exports = router;
