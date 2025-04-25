const express = require('express');
const { check, validationResult } = require('express-validator');
const TreatmentPlan = require('../models/TreatmentPlan');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/treatment-plans
// @desc    Get all treatment plans
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const treatmentPlans = await TreatmentPlan.find()
      .populate('patient', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(treatmentPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/treatment-plans
// @desc    Create a treatment plan
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('patient', 'Patient is required').not().isEmpty(),
      check('diagnosis', 'Diagnosis is required').not().isEmpty(),
      check('procedures', 'Procedures are required').isArray({ min: 1 }),
      check('totalCost', 'Total cost is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const treatmentPlan = new TreatmentPlan(req.body);
      await treatmentPlan.save();
      res.json(treatmentPlan);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/treatment-plans/:id
// @desc    Get treatment plan by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.findById(req.params.id)
      .populate('patient', 'firstName lastName');

    if (!treatmentPlan) {
      return res.status(404).json({ msg: 'Treatment plan not found' });
    }

    res.json(treatmentPlan);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Treatment plan not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/treatment-plans/:id
// @desc    Update a treatment plan
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('patient', 'firstName lastName');

    if (!treatmentPlan) {
      return res.status(404).json({ msg: 'Treatment plan not found' });
    }

    res.json(treatmentPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/treatment-plans/:id
// @desc    Delete a treatment plan
// @access  Private
router.delete('/:id', [protect, authorize('admin', 'dentist')], async (req, res) => {
  try {
    const treatmentPlan = await TreatmentPlan.findById(req.params.id);

    if (!treatmentPlan) {
      return res.status(404).json({ msg: 'Treatment plan not found' });
    }

    await treatmentPlan.remove();
    res.json({ msg: 'Treatment plan removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 