const express = require('express');
// // eslint-disable-next-line camelcase
// const { getPharmacyOrder_reqs, getPharmacyOrder_req } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { sendorderbill, allorderbills } = require('../../controller/pharmacy/orderbill');

const router = express.Router();

router.post('/pharmacy/sendorderbill', requireSignin, pharmacyMiddleware, sendorderbill);
router.get('/pharmacy/allorderbills', requireSignin, pharmacyMiddleware, allorderbills);

module.exports = router;
