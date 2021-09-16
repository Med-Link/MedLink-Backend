const express = require('express');
const { requireSignin, pharmacyMiddleware } = require('../../common-middleware');
const {
  addstock, updatestock, deletestock, viewallstock, viewsinglestock, listmedicine, viewOutofStock, addcsv
} = require('../../controller/pharmacy/stock');

const router = express.Router();

router.post('/pharmacy/addstock', requireSignin, pharmacyMiddleware, addstock);
router.post('/pharmacy/addcsv', requireSignin, pharmacyMiddleware, addcsv);
router.post('/pharmacy/updatestock', requireSignin, pharmacyMiddleware, updatestock);
router.post('/pharmacy/deletestock', requireSignin, pharmacyMiddleware, deletestock);
router.get('/pharmacy/viewallstock', requireSignin, pharmacyMiddleware, viewallstock);
router.post('/pharmacy/viewsinglestock', requireSignin, pharmacyMiddleware, viewsinglestock);
router.get('/pharmacy/listmedicine', requireSignin, pharmacyMiddleware, listmedicine);
router.get('/pharmacy/viewoutofstock', requireSignin, pharmacyMiddleware, viewOutofStock);

module.exports = router;
