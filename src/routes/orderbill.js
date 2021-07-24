const express = require('express');
// eslint-disable-next-line camelcase
const { allorderbills, singleorderbill, acceptorderbill } = require('../controller/orderbill');
const { requireSignin, customerMiddleware } = require('../common-middleware');

const router = express.Router();

router.get('/order/allorderbills', requireSignin, customerMiddleware, allorderbills);
router.post('/order/singleorderbill', requireSignin, customerMiddleware, singleorderbill);
router.post('/order/acceptorderbill', requireSignin, customerMiddleware, acceptorderbill);

module.exports = router;
