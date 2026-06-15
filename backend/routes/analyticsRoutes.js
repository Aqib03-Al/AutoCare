const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth, roleCheck('admin', 'staff'));

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/monthly', roleCheck('admin'), analyticsController.getMonthlyAnalytics);
router.get('/trend', roleCheck('admin'), analyticsController.getTrendAnalytics);

module.exports = router;
