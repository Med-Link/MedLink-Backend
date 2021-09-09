const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const {
  addstock, updatestock, deletestock, viewallstock, viewsinglestock, listmedicine
} = require('../../controller/pharmacy/stock');

const router = express.Router();

router.post('/pharmacy/addstock', requireSignin, pharmacyMiddleware, addstock);
router.post('/pharmacy/updatestock', requireSignin, pharmacyMiddleware, updatestock);
router.delete('/pharmacy/deletestock', requireSignin, pharmacyMiddleware, deletestock);
router.get('/pharmacy/viewallstock', requireSignin, pharmacyMiddleware, viewallstock);
router.post('/pharmacy/viewsinglestock', requireSignin, pharmacyMiddleware, viewsinglestock);
router.get('/pharmacy/listmedicine', requireSignin, pharmacyMiddleware, listmedicine);

module.exports = router;
