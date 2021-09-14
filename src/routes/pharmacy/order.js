const express = require('express');
const {
  // eslint-disable-next-line camelcase
  getPharmacyOrder_reqs, getPharmacyOrder_req, rejectOrder_req, countAcceptedOrders,
} = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');

const router = express.Router();

router.get('/pharmacy/getOrderReqs', requireSignin, pharmacyMiddleware, getPharmacyOrder_reqs);
router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);
router.post('/pharmacy/rejectOrderReq', requireSignin, pharmacyMiddleware, rejectOrder_req);

router.get('/pharmacy/countacceptedorders', requireSignin, pharmacyMiddleware, countAcceptedOrders);

module.exports = router;
