const express = require('express');
// eslint-disable-next-line camelcase
const { requireSignin, customerMiddleware } = require('../common-middleware');
const { allpharmacies, pharmacybydistrict, pharmacybymedicine, searchmedicine } = require('../controller/findpharmacy');

const router = express.Router();

router.post('/order/pharmacybydistrict', requireSignin, customerMiddleware, pharmacybydistrict);
router.post('/order/pharmacybymedicine', requireSignin, customerMiddleware, pharmacybymedicine);
router.post('/order/allpharmacies', requireSignin, customerMiddleware, allpharmacies);
router.post('/order/searchmedicine', requireSignin, customerMiddleware, searchmedicine);

module.exports = router;
