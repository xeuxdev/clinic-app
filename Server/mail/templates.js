// emailTemplates.js

export const emailTemplates = {
  // 1. Welcome Email
  welcome: (name) => ({
    subject: "🎉 Welcome to Our Platform!",
    text: `Hi ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nCheers,\nThe Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform</title>
      </head>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background:#f8fafc;">
          <tr>
            <td style="padding:40px 30px; text-align:center; background:#4f46e5; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">Welcome to Our Platform!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px; background:#ffffff;">
              <h2 style="margin:0 0 20px 0; color:#1e293b;">Hello ${name},</h2>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                Thank you for joining our platform. We're thrilled to have you with us!
              </p>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                Get ready to explore all the amazing features we've prepared for you.
              </p>
              <div style="text-align:center; margin:30px 0;">
                <a href="#" style="display:inline-block; padding:12px 24px; background:#4f46e5; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">Get Started</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; text-align:center; background:#f1f5f9; border-radius:0 0 8px 8px; color:#64748b; font-size:14px;">
              <p style="margin:0;">If you have any questions, feel free to <a href="mailto:support@example.com" style="color:#4f46e5; text-decoration:none;">contact our support team</a>.</p>
              <p style="margin:15px 0 0 0;">© ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),
  // 2. Request Password Reset Email
  requestPassword: (name, resetLink) => ({
    subject: "🔑 Password Reset Request",
    text: `Hi ${name},\n\nWe received a request to reset your password. Use the link below:\n${resetLink}\n\nIf you didn't request this, you can safely ignore it.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
      </head>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background:#f8fafc;">
          <tr>
            <td style="padding:40px 30px; text-align:center; background:#f59e0b; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">Password Reset Request</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px; background:#ffffff;">
              <h2 style="margin:0 0 20px 0; color:#1e293b;">Hi ${name},</h2>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                We received a request to reset your password. Click the button below to proceed:
              </p>
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetLink}" style="display:inline-block; padding:12px 24px; background:#f59e0b; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">Reset Password</a>
              </div>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                This link will expire in 24 hours. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; text-align:center; background:#f1f5f9; border-radius:0 0 8px 8px; color:#64748b; font-size:14px;">
              <p style="margin:0;">For security reasons, don't share this email with anyone.</p>
              <p style="margin:15px 0 0 0;">© ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),
  // 3. Password Reset Successful Email
  resetSuccess: (name) => ({
    subject: "✅ Password Reset Successful",
    text: `Hi ${name},\n\nYour password was successfully reset. If this wasn't you, please contact support immediately.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
      </head>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background:#f8fafc;">
          <tr>
            <td style="padding:40px 30px; text-align:center; background:#10b981; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">Password Reset Successful</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px; background:#ffffff;">
              <h2 style="margin:0 0 20px 0; color:#1e293b;">Hi ${name},</h2>
              <div style="background:#ecfdf5; padding:20px; border-radius:8px; margin-bottom:20px;">
                <p style="margin:0; color:#047857; font-weight:600; text-align:center;">
                  Your password has been successfully updated.
                </p>
              </div>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                If you didn't make this change or believe your account has been compromised, please contact our support team immediately.
              </p>
              <div style="text-align:center; margin:30px 0;">
                <a href="#" style="display:inline-block; padding:12px 24px; background:#10b981; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">Login to Your Account</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; text-align:center; background:#f1f5f9; border-radius:0 0 8px 8px; color:#64748b; font-size:14px;">
              <p style="margin:0;">Need help? <a href="mailto:support@example.com" style="color:#10b981; text-decoration:none;">Contact our support team</a></p>
              <p style="margin:15px 0 0 0;">© ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),
  // 4. Doctor Booking Notification Email
  doctorBooking: (doctorName, patientName, bookingDate, bookingTime) => ({
    subject: `📅 New Appointment Booking with ${patientName}`,
    text: `Hello Dr. ${doctorName},\n\nYou have a new appointment booked.\n\nPatient: ${patientName}\nDate: ${bookingDate}\nTime: ${bookingTime}\n\nPlease log in to your dashboard for more details.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Booking</title>
      </head>
      <body style="margin:0; padding:0; font-family:'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:auto; background:#f8fafc;">
          <tr>
            <td style="padding:40px 30px; text-align:center; background:#3b82f6; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">New Appointment Scheduled</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px; background:#ffffff;">
              <h2 style="margin:0 0 20px 0; color:#1e293b;">Dr. ${doctorName},</h2>
              <p style="margin:0 0 20px 0; color:#475569; line-height:1.6;">
                You have a new appointment scheduled with a patient. Here are the details:
              </p>

              <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px; background:#eff6ff; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:15px; border-bottom:1px solid #dbeafe;">
                    <strong style="color:#1e40af;">Patient Name:</strong>
                  </td>
                  <td style="padding:15px; border-bottom:1px solid #dbeafe; color:#1e293b;">
                    ${patientName}
                  </td>
                </tr>
                <tr>
                  <td style="padding:15px; border-bottom:1px solid #dbeafe;">
                    <strong style="color:#1e40af;">Appointment Date:</strong>
                  </td>
                  <td style="padding:15px; border-bottom:1px solid #dbeafe; color:#1e293b;">
                    ${bookingDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding:15px;">
                    <strong style="color:#1e40af;">Appointment Time:</strong>
                  </td>
                  <td style="padding:15px; color:#1e293b;">
                    ${bookingTime}
                  </td>
                </tr>
              </table>

              <div style="text-align:center;">
                <a href="#" style="display:inline-block; padding:12px 24px; background:#3b82f6; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">View Appointment Details</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; text-align:center; background:#f1f5f9; border-radius:0 0 8px 8px; color:#64748b; font-size:14px;">
              <p style="margin:0;">Need to reschedule? <a href="#" style="color:#3b82f6; text-decoration:none;">Contact the patient</a></p>
              <p style="margin:15px 0 0 0;">© ${new Date().getFullYear()} Healthcare Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  })
}