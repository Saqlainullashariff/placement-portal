const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'selected', 'rejected', 'pending'],
    default: 'registered'
  },
  roundResults: [{
    roundName: String,
    status: String,
    feedback: String,
    date: Date
  }],
  offerLetter: String,
  finalCTC: String
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ driveId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);