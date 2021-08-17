const express = require('express');
// eslint-disable-next-line camelcase
const { allorderbills, singleorderbill, acceptorderbill, acceptedbills, rejectbills } = require('../controller/orderbill');
const { requireSignin, customerMiddleware } = require('../common-middleware');

const router = express.Router();

router.get('/order/allorderbills', requireSignin, customerMiddleware, allorderbills);
router.post('/order/singleorderbill', requireSignin, customerMiddleware, singleorderbill);
router.post('/order/acceptorderbill', requireSignin, customerMiddleware, acceptorderbill);
router.get('/order/acceptedbills', requireSignin, customerMiddleware, acceptedbills);
router.post('/order/rejectbill', requireSignin, customerMiddleware, rejectbills);


module.exports = router;
