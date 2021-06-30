const express = require('express');
const { getPharmacyOrder_reqs, getPharmacyOrder_req } = require('../../controller/pharmacy/order');

const router = express.Router();

router.get('/pharmacy/getOrderReqs', getPharmacyOrder_reqs);
router.post('/pharmacy/getOrderReq', getPharmacyOrder_req);


module.exports = router;
