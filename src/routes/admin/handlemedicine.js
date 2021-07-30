const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');

const router = express.Router();
const { addmedicine, viewallmedicine, deletemedicine } = require('../../controller/admin/handlemedicine');
// const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

// router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);
router.post('/admin/addmedicine', requireSignin, adminMiddleware, addmedicine);
router.get('/admin/viewallmedicine', requireSignin, adminMiddleware, viewallmedicine);
router.post('/admin/deletemedicine', requireSignin, adminMiddleware, deletemedicine);

module.exports = router;
