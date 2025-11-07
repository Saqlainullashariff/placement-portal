// const express = require('express');
// const router = express.Router();

// // Add your Drive routes here later

// module.exports = router;

const express = require('express');
const router = express.Router();

// --- ADD THESE LINES ---
const { authenticate } = require('../middleware/auth');
const driveController = require('../controllers/driveController');

// This route will handle GET requests to /api/drives
// It will first authenticate the user, then run the getAllDrives controller
router.get('/', authenticate, driveController.getAllDrives);

// --- ADD YOUR OTHER DRIVE ROUTES HERE ---
// router.post('/', authenticate, driveController.createDrive);
// router.get('/:id', authenticate, driveController.getDriveById);


// This line MUST be at the very bottom
module.exports = router;