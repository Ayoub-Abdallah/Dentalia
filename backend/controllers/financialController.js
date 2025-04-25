const Financial = require('../models/Financial');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all financial records
// @route   GET /api/financial
// @access  Private
exports.getAllFinancials = asyncHandler(async (req, res, next) => {
  console.log('Getting all financial records...');
  const financials = await Financial.find().sort({ createdAt: -1 });
  console.log(`Found ${financials.length} financial records`);
  res.status(200).json({ success: true, data: financials });
});

// @desc    Get financial summary
// @route   GET /api/financial/summary
// @access  Private
exports.getFinancialSummary = asyncHandler(async (req, res, next) => {
  const summary = await Financial.aggregate([
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const formattedSummary = {
    income: {
      total: 0,
      count: 0
    },
    expense: {
      total: 0,
      count: 0
    }
  };

  summary.forEach(item => {
    formattedSummary[item._id] = {
      total: item.total,
      count: item.count
    };
  });

  res.status(200).json({
    success: true,
    data: formattedSummary
  });
});

// @desc    Get single financial record
// @route   GET /api/financial/:id
// @access  Private
exports.getFinancial = asyncHandler(async (req, res, next) => {
  console.log('Getting financial record with ID:', req.params.id);
  const financial = await Financial.findById(req.params.id);

  if (!financial) {
    console.log('Financial record not found');
    return next(new ErrorResponse(`Financial record not found with id of ${req.params.id}`, 404));
  }

  console.log('Financial record found:', financial);
  res.status(200).json({ success: true, data: financial });
});

// @desc    Create new financial record
// @route   POST /api/financial
// @access  Private
exports.createFinancial = asyncHandler(async (req, res, next) => {
  console.log('Creating new financial record with data:', req.body);
  console.log('User ID:', req.user.id);

  try {
    req.body.createdBy = req.user.id;
    console.log('Creating financial record in database...');
    const financial = await Financial.create(req.body);
    console.log('Financial record created successfully:', financial);

    res.status(201).json({ success: true, data: financial });
  } catch (error) {
    console.error('Error creating financial record:', error);
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Update financial record
// @route   PUT /api/financial/:id
// @access  Private
exports.updateFinancial = asyncHandler(async (req, res, next) => {
  console.log('Updating financial record with ID:', req.params.id);
  console.log('Update data:', req.body);

  const financial = await Financial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!financial) {
    console.log('Financial record not found for update');
    return next(new ErrorResponse(`Financial record not found with id of ${req.params.id}`, 404));
  }

  console.log('Financial record updated successfully:', financial);
  res.status(200).json({ success: true, data: financial });
});

// @desc    Delete financial record
// @route   DELETE /api/financial/:id
// @access  Private
exports.deleteFinancial = asyncHandler(async (req, res, next) => {
  console.log('Deleting financial record with ID:', req.params.id);

  const financial = await Financial.findByIdAndDelete(req.params.id);

  if (!financial) {
    console.log('Financial record not found for deletion');
    return next(new ErrorResponse(`Financial record not found with id of ${req.params.id}`, 404));
  }

  console.log('Financial record deleted successfully');
  res.status(200).json({ success: true, data: {} });
}); 