const Drive = require('../models/Drive');
const Registration = require('../models/Registration');
const emailService = require('../services/emailService');

exports.createDrive = async (req, res) => {
  try {
    const drive = new Drive({
      ...req.body,
      createdBy: req.user.userId
    });

    await drive.save();

    // Send notifications to eligible students
    await emailService.notifyNewDrive(drive);

    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerForDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const studentId = req.user.userId;

    // Check if already registered
    const existingReg = await Registration.findOne({ driveId, studentId });
    if (existingReg) {
      return res.status(400).json({ error: 'Already registered for this drive' });
    }

    const registration = new Registration({
      driveId,
      studentId
    });

    await registration.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};