const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');

const router = express.Router();
const { addmedicine, viewallmedicine } = require('../../controller/admin/handlemedicine');
// const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

// router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);
router.post('/admin/addmedicine', requireSignin, adminMiddleware, addmedicine);
router.get('/admin/addmedicine', requireSignin, adminMiddleware, viewallmedicine);


// router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
