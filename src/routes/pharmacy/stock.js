const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const { addstock, updatestock, deletestock } = require('../../controller/pharmacy/stock');

const router = express.Router();

router.post('/pharmacy/addstock', requireSignin, pharmacyMiddleware, addstock);
router.post('/pharmacy/updatestock', requireSignin, pharmacyMiddleware, updatestock);
router.delete('/pharmacy/deletestock', requireSignin, pharmacyMiddleware, deletestock);

module.exports = router;
