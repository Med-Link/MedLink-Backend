const express = require('express');

const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { viewmonthlyincome,totalmonthlyincome,customedaterangeincome } = require('../../controller/admin/income');

router.get('/admin/viewmonthlyincome', requireSignin, adminMiddleware, viewmonthlyincome);
router.get('/admin/totalmonthlyincome', requireSignin, adminMiddleware, totalmonthlyincome);
router.post('/admin/customedaterangeincome', requireSignin, adminMiddleware, customedaterangeincome);


module.exports = router;
