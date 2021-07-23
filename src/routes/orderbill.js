const express = require('express');
// eslint-disable-next-line camelcase
const { allorderbills } = require('../controller/orderbill');
const { requireSignin, customerMiddleware } = require('../common-middleware');

const router = express.Router();

router.post('/order/create', requireSignin, customerMiddleware, allorderbills);

module.exports = router;
