const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');

const router = express.Router();
const { viewprofile } = require('../../controller/admin/userprofile');

// router.get('/admin/viewprofile', viewprofile);
router.get('/admin/viewprofile', requireSignin, adminMiddleware, viewprofile);

module.exports = router;
