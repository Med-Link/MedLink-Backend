const express = require('express');
// eslint-disable-next-line camelcase
const { getPharmacyOrder_reqs, getPharmacyOrder_req, countAcceptedOrders } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');

const router = express.Router();

router.get('/pharmacy/getOrderReqs', requireSignin, pharmacyMiddleware, getPharmacyOrder_reqs);
router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);
router.get('/pharmacy/countacceptedorders', requireSignin, pharmacyMiddleware, countAcceptedOrders);

module.exports = router;
