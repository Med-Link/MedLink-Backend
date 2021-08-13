const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { countcustomer } = require('../../controller/admin/dashboard');

const router = express.Router();
// const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

// router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);
router.get('/admin/countcustomer', countcustomer);
// router.get('/admin/viewallmedicine', requireSignin, adminMiddleware, viewallmedicine);
module.exports = router;
