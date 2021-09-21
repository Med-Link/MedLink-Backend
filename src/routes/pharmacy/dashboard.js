const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const {incomegrowth} = require('../../controller/pharmacy/dashboard');

const router = express.Router();

router.get('/pharmacy/incomegrowth', requireSignin, pharmacyMiddleware, incomegrowth);

module.exports = router;
