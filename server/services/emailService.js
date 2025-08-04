const nodemailer = require('nodemailer');

// Create transporter for Gmail
let transporter;

try {
  console.log('Email password available:', !!process.env.EMAIL_PASS);
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'rohitpokalwar95@gmail.com',
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Verify the transporter
  transporter.verify(function(error, success) {
    if (error) {
      console.error('Email transporter verification failed:', error);
      console.log('Trying alternative configuration...');
      // Try alternative configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rohitpokalwar95@gmail.com',
          pass: process.env.EMAIL_PASS
        }
      });
      
      transporter.verify(function(error2, success2) {
        if (error2) {
          console.error('Alternative email transporter also failed:', error2);
          transporter = null;
        } else {
          console.log('Alternative email transporter is ready');
        }
      });
    } else {
      console.log('Email transporter is ready');
    }
  });
} catch (error) {
  console.error('Error creating email transporter:', error);
  transporter = null;
}

// Email template for appointment confirmation
const sendAppointmentConfirmation = async (patientEmail, appointmentData) => {
  const { patientName, doctorName, clinicName, date, time } = appointmentData;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: 'rohitpokalwar95@gmail.com',
    to: patientEmail,
    subject: 'Appointment Confirmation - Healthcare System',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🏥 Healthcare Appointment System</h1>
          <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Your appointment has been successfully booked!</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 25px; border-radius: 8px; margin-bottom: 20px; backdrop-filter: blur(10px);">
          <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 22px; text-align: center;">Appointment Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffd700;">👤 Patient:</strong>
            <span style="color: #ffffff; margin-left: 10px;">${patientName}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffd700;">👨‍⚕️ Doctor:</strong>
            <span style="color: #ffffff; margin-left: 10px;">${doctorName}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffd700;">🏥 Clinic:</strong>
            <span style="color: #ffffff; margin-left: 10px;">${clinicName}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffd700;">📅 Date:</strong>
            <span style="color: #ffffff; margin-left: 10px;">${formattedDate}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffd700;">⏰ Time:</strong>
            <span style="color: #ffffff; margin-left: 10px;">${time}</span>
          </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #ffd700; margin: 0 0 15px 0; font-size: 18px;">📋 Important Reminders:</h3>
          <ul style="color: #ffffff; margin: 0; padding-left: 20px;">
            <li>Please arrive 10 minutes before your scheduled appointment time</li>
            <li>Bring your ID and any relevant medical documents</li>
            <li>For any questions, contact your clinic directly</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
          <p style="color: #e0e0e0; margin: 0; font-size: 14px;">
            Thank you for choosing our healthcare system.<br>
            We look forward to providing you with excellent care!
          </p>
          <p style="color: #b0b0b0; margin: 10px 0 0 0; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }
    
    console.log('Attempting to send email to:', patientEmail);
    console.log('Email configuration:', {
      user: 'rohitpokalwar95@gmail.com',
      passConfigured: !!process.env.EMAIL_PASS
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    return false;
  }
};

module.exports = {
  sendAppointmentConfirmation
}; 