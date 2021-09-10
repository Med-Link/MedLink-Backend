const express = require('express');
// // eslint-disable-next-line camelcase
// const { getPharmacyOrder_reqs, getPharmacyOrder_req } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { viewallcloseddeals } = require('../../controller/pharmacy/completedorders');

const router = express.Router();

router.get('/pharmacy/viewallcloseddeals', requireSignin, pharmacyMiddleware, viewallcloseddeals);

module.exports = router;
