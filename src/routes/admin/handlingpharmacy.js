const express = require('express');

const router = express.Router();
const { acceptpharmacy, rejectpharmacy } = require('../../controller/admin/handlingpharmacy');
const { requireSignin, adminMiddleware } = require('../../common-middleware');

router.post('/admin/acceptpharmacy', requireSignin, adminMiddleware, acceptpharmacy);
router.post('/admin/rejectpharmacy', requireSignin, adminMiddleware, rejectpharmacy);

module.exports = router;
