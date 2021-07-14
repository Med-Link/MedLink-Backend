const express = require('express');

const router = express.Router();
const { addnewAdmin } = require('../../controller/admin/addnewAdmin');
const { isRequestValidated, validateSigninRequest } = require('../../validators/auth');

router.post('/admin/addnewAdmin', validateSigninRequest, isRequestValidated, addnewAdmin);

// router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
