const express = require('express');
// // eslint-disable-next-line camelcase
// const { getPharmacyOrder_reqs, getPharmacyOrder_req } = require('../../controller/pharmacy/order');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { countcloseddeals, closeddeals, shippeddeals, markshipped } = require('../../controller/pharmacy/completedorders');


const router = express.Router();

// router.get('/pharmacy/viewallcloseddeals', requireSignin, pharmacyMiddleware, viewallcloseddeals);
router.get('/pharmacy/countcloseddeals', requireSignin, pharmacyMiddleware, countcloseddeals);
router.get('/pharmacy/closeddeals', requireSignin, pharmacyMiddleware, closeddeals);
router.get('/pharmacy/shippeddeals', requireSignin, pharmacyMiddleware, shippeddeals);
router.post('/pharmacy/shippeddeals', requireSignin, pharmacyMiddleware, markshipped);




module.exports = router;
