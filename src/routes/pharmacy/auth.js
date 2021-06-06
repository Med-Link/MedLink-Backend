const express = require('express');
const router = express.Router();
const {signup,signin, requireSignin} = require('../../controller/pharmacy/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');


router.post('/pharmacy/signin',validateSigninRequest, isRequestValidated, signin);
router.post('/pharmacy/signup', validateSignupRequest, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports =router;
