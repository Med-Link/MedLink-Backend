const express = require('express');
// eslint-disable-next-line camelcase
const { requireSignin, customerMiddleware } = require('../common-middleware');
const { allpharmacies, pharmacybymedicine, searchmedicine, pharmacybylocation } = require('../controller/findpharmacy');

const router = express.Router();

router.post('/order/pharmacybylocation', requireSignin, customerMiddleware, pharmacybylocation);
router.post('/order/pharmacybymedicine', requireSignin, customerMiddleware, pharmacybymedicine);
router.get('/order/allpharmacies', requireSignin, customerMiddleware, allpharmacies);
router.post('/order/searchmedicine', requireSignin, customerMiddleware, searchmedicine);

module.exports = router;
