const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { countcustomer, countpharmacy,maxsalespharmacy,averageorderspermonth} = require('../../controller/admin/dashboard');

const router = express.Router();
router.get('/admin/countcustomer', requireSignin, adminMiddleware, countcustomer);
router.get('/admin/countpharmacy', requireSignin, adminMiddleware, countpharmacy);
router.get('/admin/maxsalespharmacy', requireSignin, adminMiddleware, maxsalespharmacy);
router.get('/admin/averageorderspermonth', requireSignin, adminMiddleware, averageorderspermonth);

module.exports = router;
