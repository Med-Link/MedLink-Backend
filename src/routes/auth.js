const express = require('express');
const {
  signup, signin, forgotpassword, resetpassword, verifyemail,
} = require('../controller/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword', resetpassword);
router.post('/verifyemail', verifyemail);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
