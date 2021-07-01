const express = require('express');
// eslint-disable-next-line camelcase
const { addOrder, getOrder_reqs, getOrder_req } = require('../controller/order');
const { requireSignin, customerMiddleware, uploadS3 } = require('../common-middleware');

const router = express.Router();

router.post('/order/create', requireSignin, customerMiddleware, uploadS3.array('prescription'), addOrder);

router.get('/order/getOrder_reqs', getOrder_reqs);
router.post('/order/getOrder_req', getOrder_req);

module.exports = router;
