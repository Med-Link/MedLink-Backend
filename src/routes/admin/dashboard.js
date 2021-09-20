const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { countcustomer, countpharmacy,viewmonthlyincome } = require('../../controller/admin/dashboard');

const router = express.Router();
// const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

// router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);
router.get('/admin/countcustomer', requireSignin, adminMiddleware, countcustomer);
router.get('/admin/countpharmacy', requireSignin, adminMiddleware, countpharmacy);

module.exports = router;
