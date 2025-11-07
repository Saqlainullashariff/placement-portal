const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'hod', 'tpo'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: function() {
      return this.role === 'student' || this.role === 'hod';
    }
  },
  phone: String,
  cgpa: {
    type: Number,
    required: function() {
      return this.role === 'student';
    }
  },
  rollNumber: String,
  resume: String,
  approved: {
    type: Boolean,
    default: false
  },
  profileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);