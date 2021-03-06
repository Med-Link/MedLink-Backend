const express = require('express');
const { requireSignin } = require('../common-middleware');
const {
  signup, signin, forgotpassword, resetpassword, verifyemail, signout,
} = require('../controller/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

const router = express.Router();

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/forgotpassword', forgotpassword);
router.post('/resetcustomerpassword', resetpassword);
router.post('/verifyemail', verifyemail);
router.post('/signout', signout);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
