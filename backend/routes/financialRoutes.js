const express = require('express');
const router = express.Router();
const {
  getAllFinancials,
  getFinancial,
  createFinancial,
  updateFinancial,
  deleteFinancial
} = require('../controllers/financialController');

// Protect all routes
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllFinancials)
  .post(createFinancial);

router.route('/:id')
  .get(getFinancial)
  .put(updateFinancial)
  .delete(deleteFinancial);

module.exports = router; 