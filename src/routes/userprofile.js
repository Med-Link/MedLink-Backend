const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');

const router = express.Router();
const { viewprofile } = require('../controller/userprofile');
// const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

// router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);
router.get('/viewprofile', viewprofile);

// router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
