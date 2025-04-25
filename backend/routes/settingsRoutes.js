const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  createSettings
} = require('../controllers/settingsController');

// Protect all routes
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSettings)
  .post(createSettings)
  .put(updateSettings);

module.exports = router; 