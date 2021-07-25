const express = require('express');
// eslint-disable-next-line camelcase
const { requireSignin, customerMiddleware } = require('../common-middleware');
const { completeorder } = require('../controller/completedorders');

const router = express.Router();

router.post('/order/completeorder', requireSignin, customerMiddleware, completeorder);
// router.post('/order/acceptorderbill', requireSignin, customerMiddleware, acceptorderbill);
// router.get('/order/acceptedbills', requireSignin, customerMiddleware, acceptedbills);

module.exports = router;
