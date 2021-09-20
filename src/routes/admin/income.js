const express = require('express');

const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { viewmonthlyincome } = require('../../controller/admin/income');

router.get('/admin/viewmonthlyincome', requireSignin, adminMiddleware, viewmonthlyincome);

module.exports = router;
