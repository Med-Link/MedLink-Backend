const express = require('express');
const { uploadpS3 } = require('../../common-middleware');

const router = express.Router();
const { signup, signin } = require('../../controller/pharmacy/auth');
const { isRequestValidated, validateSigninRequest, validateSignupRequestpharm } = require('../../validators/auth');

router.post('/pharmacy/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/pharmacy/signup', uploadpS3.array('registrationDocs'), validateSignupRequestpharm, isRequestValidated, signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports = router;
