const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { countcustomer, countpharmacy,maxsalespharmacy,averageorderspermonth,incomegrowth} = require('../../controller/admin/dashboard');

const router = express.Router();
router.get('/admin/countcustomer', requireSignin, adminMiddleware, countcustomer);
router.get('/admin/countpharmacy', requireSignin, adminMiddleware, countpharmacy);
router.get('/admin/maxsalespharmacy', requireSignin, adminMiddleware, maxsalespharmacy);
router.get('/admin/averageorderspermonth', requireSignin, adminMiddleware, averageorderspermonth);
router.get('/admin/incomegrowth', requireSignin, adminMiddleware, incomegrowth);


module.exports = router;
