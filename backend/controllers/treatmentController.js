const Treatment = require('../models/Treatment');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all treatments
// @route   GET /api/treatments
// @access  Private
exports.getTreatments = asyncHandler(async (req, res, next) => {
  const treatments = await Treatment.find()
    .populate({
      path: 'patient',
      select: 'firstName lastName email'
    });
  
  console.log('Treatments with populated patients:', treatments); // Debug log
  res.status(200).json({ success: true, data: treatments });
});

// @desc    Get single treatment
// @route   GET /api/treatments/:id
// @access  Private
exports.getTreatment = asyncHandler(async (req, res, next) => {
  const treatment = await Treatment.findById(req.params.id)
    .populate({
      path: 'patient',
      select: 'firstName lastName email'
    });

  if (!treatment) {
    return next(new ErrorResponse(`Treatment not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: treatment });
});

// @desc    Create new treatment
// @route   POST /api/treatments
// @access  Private
exports.createTreatment = asyncHandler(async (req, res, next) => {
  const treatment = await Treatment.create(req.body);
  res.status(201).json({ success: true, data: treatment });
});

// @desc    Update treatment
// @route   PUT /api/treatments/:id
// @access  Private
exports.updateTreatment = asyncHandler(async (req, res, next) => {
  let treatment = await Treatment.findById(req.params.id);

  if (!treatment) {
    return next(new ErrorResponse(`Treatment not found with id of ${req.params.id}`, 404));
  }

  treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: treatment });
});

// @desc    Delete treatment
// @route   DELETE /api/treatments/:id
// @access  Private
exports.deleteTreatment = asyncHandler(async (req, res, next) => {
  const treatment = await Treatment.findByIdAndDelete(req.params.id);

  if (!treatment) {
    return next(new ErrorResponse(`Treatment not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
}); 