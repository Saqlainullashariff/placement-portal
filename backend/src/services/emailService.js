const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

exports.notifyNewDrive = async (drive) => {
  try {
    // Get all approved students
    const students = await User.find({ 
      role: 'student', 
      approved: true 
    });

    const emailPromises = students.map(student => {
      const html = `
        <h2>New Placement Drive</h2>
        <p>Dear ${student.name},</p>
        <p>A new placement drive has been posted:</p>
        <ul>
          <li><strong>Company:</strong> ${drive.company}</li>
          <li><strong>Role:</strong> ${drive.role}</li>
          <li><strong>CTC:</strong> ${drive.ctc}</li>
          <li><strong>Eligibility:</strong> CGPA >= ${drive.eligibility.minCGPA}</li>
        </ul>
        <p>Log in to the portal to register for this drive.</p>
        <p>Best regards,<br>Placement Cell</p>
      `;

      return this.sendEmail(student.email, `New Drive: ${drive.company}`, html);
    });

    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error notifying students:', error);
  }
};

exports.notifySelection = async (studentEmail, studentName, drive, round) => {
  const html = `
    <h2>Congratulations!</h2>
    <p>Dear ${studentName},</p>
    <p>You have been selected in the ${round} round for ${drive.company}.</p>
    <p>Please check the portal for next steps.</p>
    <p>Best regards,<br>Placement Cell</p>
  `;

  await this.sendEmail(studentEmail, `Selected - ${drive.company}`, html);
};

exports.notifyRejection = async (studentEmail, studentName, drive, round) => {
  const html = `
    <h2>Update on Your Application</h2>
    <p>Dear ${studentName},</p>
    <p>Thank you for your interest in the ${drive.role} position at ${drive.company}.</p>
    <p>Unfortunately, we will not be moving forward with your application after the ${round} round.</p>
    <p>We encourage you to apply for other opportunities on the portal.</p>
    <p>Best regards,<br>Placement Cell</p>
  `;

  await this.sendEmail(studentEmail, `Application Update - ${drive.company}`, html);
};