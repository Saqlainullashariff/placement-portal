const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  description: String,
  eligibility: {
    minCGPA: Number,
    departments: [String],
    maxBacklogs: Number
  },
  ctc: String,
  location: String,
  date: Date,
  deadline: Date,
  status: {
    type: String,
    enum: ['active', 'closed', 'completed'],
    default: 'active'
  },
  rounds: [{
    name: String,
    date: Date,
    type: String,
    description: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);