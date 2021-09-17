const express = require('express');
const { uploadpS3, requireSignin } = require('../../common-middleware');

const router = express.Router();
const { signup, signin, signout, forgotpassword, resetpassword, verifyemail } = require('../../controller/pharmacy/auth');
const { isRequestValidated, validateSigninRequest, validateSignupRequestpharm } = require('../../validators/auth');

router.post('/pharmacy/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/pharmacy/signup', uploadpS3.array('registrationDocs'), validateSignupRequestpharm, isRequestValidated, signup);
router.post('/pharmacy/signout', signout);
router.post('/pharmacy/forgotpassword', forgotpassword);
router.post('/pharmacy/resetpassword', resetpassword);
router.post('/pharmacy/verifyemail', verifyemail);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
