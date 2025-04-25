export const getAppointmentConfirmationTemplate = (patientName, appointmentDate, dentistName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Appointment Confirmation</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment has been confirmed with the following details:</p>
    <ul>
      <li><strong>Date:</strong> ${appointmentDate}</li>
      <li><strong>Dentist:</strong> ${dentistName}</li>
    </ul>
    <p>Please arrive 15 minutes before your scheduled time.</p>
    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    <p>Best regards,<br>Dental Clinic Team</p>
  </div>
`;

export const getPaymentConfirmationTemplate = (patientName, amount, invoiceNumber) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Payment Confirmation</h2>
    <p>Dear ${patientName},</p>
    <p>We have received your payment of $${amount} for invoice #${invoiceNumber}.</p>
    <p>Thank you for your payment. A receipt has been attached to this email.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>Dental Clinic Team</p>
  </div>
`;

export const getReminderTemplate = (patientName, appointmentDate, dentistName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2c3e50;">Appointment Reminder</h2>
    <p>Dear ${patientName},</p>
    <p>This is a friendly reminder about your upcoming appointment:</p>
    <ul>
      <li><strong>Date:</strong> ${appointmentDate}</li>
      <li><strong>Dentist:</strong> ${dentistName}</li>
    </ul>
    <p>Please arrive 15 minutes before your scheduled time.</p>
    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    <p>Best regards,<br>Dental Clinic Team</p>
  </div>
`; 