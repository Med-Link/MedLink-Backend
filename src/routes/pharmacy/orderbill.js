const express = require('express');
// // eslint-disable-next-line camelcase
// const { getPharmacyOrder_reqs, getPharmacyOrder_req } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { sendorderbill } = require('../../controller/pharmacy/orderbill');

const router = express.Router();

router.post('/pharmacy/sendorderbill', requireSignin, pharmacyMiddleware, sendorderbill);
// router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);

module.exports = router;
