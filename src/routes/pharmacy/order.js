const express = require('express');
// eslint-disable-next-line camelcase
const { getPharmacyOrder_reqs, getPharmacyOrder_req, rejectOrder_req } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');

const router = express.Router();

router.get('/pharmacy/getOrderReqs', requireSignin, pharmacyMiddleware, getPharmacyOrder_reqs);
router.post('/pharmacy/getOrderReq', requireSignin, pharmacyMiddleware, getPharmacyOrder_req);
router.post('/pharmacy/rejectOrderReq', requireSignin, pharmacyMiddleware, rejectOrder_req);


module.exports = router;
