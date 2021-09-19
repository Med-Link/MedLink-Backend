const express = require('express');

const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { viewpayablepharmacy, pharmacypaid } = require('../../controller/admin/pharmacypayable');

router.get('/admin/payablepharmacy', requireSignin, adminMiddleware, viewpayablepharmacy);
router.post('/admin/paypharmacy', requireSignin, adminMiddleware, pharmacypaid);

module.exports = router;
