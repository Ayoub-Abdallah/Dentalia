// const mongoose = require('mongoose');

// const treatmentPlanSchema = new mongoose.Schema({
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Patient',
//     required: true
//   },
//   dentist: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   diagnosis: {
//     type: String,
//     required: [true, 'Please add a diagnosis']
//   },
//   procedures: [{
//     name: {
//       type: String,
//       required: true
//     },
//     description: String,
//     cost: {
//       type: Number,
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'in-progress', 'completed'],
//       default: 'pending'
//     },
//     scheduledDate: Date,
//     completedDate: Date
//   }],
//   totalCost: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['active', 'completed', 'cancelled'],
//     default: 'active'
//   },
//   notes: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('TreatmentPlan', treatmentPlanSchema); 