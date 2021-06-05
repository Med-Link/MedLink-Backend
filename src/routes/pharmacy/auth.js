const express = require('express');
const router = express.Router();
const {signup,signin, requireSignin} = require('../../controller/pharmacy/auth');


router.post('/pharmacy/signin',signin);
router.post('/pharmacy/signup',signup);

// router.post('/profile', requireSignin,(req,res)=>{
//       res.status(200).json({ user:'profile'})
// });

module.exports =router;
