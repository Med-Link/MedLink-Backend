const express = require('express');
// eslint-disable-next-line camelcase
const { addOrder, getOrder_reqs, getOrder_req, rejectedorders } = require('../controller/order');
const { requireSignin, customerMiddleware, uploadS3 } = require('../common-middleware');

const router = express.Router();

router.post('/order/create', requireSignin, customerMiddleware, uploadS3.array('prescription'), addOrder);

router.get('/order/getOrder_reqs', requireSignin, customerMiddleware, getOrder_reqs);
router.post('/order/getOrder_req', requireSignin, customerMiddleware, getOrder_req);
router.get('/order/rejectedorders', requireSignin, customerMiddleware, rejectedorders);

module.exports = router;
