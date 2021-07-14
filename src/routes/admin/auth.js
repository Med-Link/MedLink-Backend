const express = require('express');

const router = express.Router();
const { signin } = require('../../controller/admin/auth');
const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
// router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
