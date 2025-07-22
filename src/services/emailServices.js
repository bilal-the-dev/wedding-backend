// src/services/emailService.js

import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
// Debug: Check if environment variables are loaded
console.log("🔍 Debug - EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "🔍 Debug - EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Password exists" : "Password missing"
);
console.log("🔍 Debug - EMAIL_FROM:", process.env.EMAIL_FROM);

// Create transporter (email configuration)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send contact form email
export const sendContactEmail = async (contactData) => {
  const { name, email, message } = contactData;

  // Email to you (notification)
  const mailOptionsToAdmin = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Your email
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5A60;">New Contact Form Submission</h2>
        <div style="background-color: #FFF0F1; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Sent from Eventify Contact Form
        </p>
      </div>
    `,
  };

  // Email to user (confirmation)
  const mailOptionsToUser = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Thanks for contacting Eventify!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5A60;">Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        
        <div style="background-color: #FFF0F1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FF5A60; margin-top: 0;">Your message:</h3>
          <p style="font-style: italic;">"${message}"</p>
        </div>
        
        <p>Best regards,<br>The Eventify Team</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Contact us: support@eventify.com | +1 (234) 567-8901
        </p>
      </div>
    `,
  };

  try {
    // Send both emails
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);

    console.log("📧 Contact emails sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

export const sendBookingConfirmationEmail = async (
  bookingData,
  venueData,
  venueOwnerData
) => {
  const {
    customerName,
    customerEmail,
    customerNumber,
    guests,
    eventTime,
    durationHours,
    totalCost,
  } = bookingData;

  const {
    venueName,
    location,
    chargesPerHour,
    callNumber: venuePhone,
  } = venueData;

  const { name: ownerName, email: ownerEmail } = venueOwnerData;

  // Format date and time
  const eventDate = new Date(eventTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventTimeFormatted = new Date(eventTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Email to customer (confirmation)
  const customerEmailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Booking Confirmation - ${venueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #FF5A60; text-align: center; margin-bottom: 30px;">🎉 Booking Confirmed!</h1>
          
          <p style="font-size: 16px;">Dear ${customerName},</p>
          <p>Thank you for booking with Eventify! Your venue booking has been confirmed.</p>
          
          <div style="background-color: #FFF0F1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #FF5A60; margin-top: 0;">Booking Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Venue:</td>
                <td style="padding: 8px 0;">${venueName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                <td style="padding: 8px 0;">${location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${eventDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0;">${eventTimeFormatted}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                <td style="padding: 8px 0;">${durationHours} hours</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold;">Guests:</td>
                <td style="padding: 8px 0;">${guests} people</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #FF5A60;">Total Cost:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #FF5A60;">₨${totalCost.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Important Information</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>Contact the venue directly for any special requirements</li>
              <li>Your booking is currently <strong>pending confirmation</strong></li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p><strong>Venue Contact:</strong> ${venuePhone}</p>
            <p><strong>Need help?</strong> Reply to this email or call us at +1 (234) 567-8901</p>
          </div>
          
          <p>We're excited to help make your event memorable!</p>
          <p>Best regards,<br>The Eventify Team</p>
        </div>
      </div>
    `,
  };

  // Email to venue owner (notification)
  const ownerEmailOptions = {
    from: process.env.EMAIL_FROM,
    to: ownerEmail,
    subject: `New Booking Request - ${venueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5A60;">🔔 New Booking Request</h2>
        
        <p>Hello ${ownerName},</p>
        <p>You have received a new booking request for your venue <strong>${venueName}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FF5A60; margin-top: 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerNumber}</p>
          
          <h3 style="color: #FF5A60;">Event Details</h3>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTimeFormatted}</p>
          <p><strong>Duration:</strong> ${durationHours} hours</p>
          <p><strong>Guests:</strong> ${guests} people</p>
          <p><strong>Total Amount:</strong> ₨${totalCost.toLocaleString()}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Action Required:</strong> Please contact the customer to confirm availability and finalize the booking.</p>
        </div>
        
        <p>Best regards,<br>The Eventify Team</p>
      </div>
    `,
  };

  try {
    // Send both emails
    await transporter.sendMail(customerEmailOptions);
    await transporter.sendMail(ownerEmailOptions);

    console.log("📧 Booking confirmation emails sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Booking email sending failed:", error);
    throw new Error("Failed to send booking emails");
  }
};

export const sendBookingStatusUpdateEmail = async (booking) => {
  const {
    customerName,
    customerEmail,
    status,
    eventTime,
    durationHours,
    guests,
    totalCost,
  } = booking;

  const eventDate = new Date(eventTime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventTimeFormatted = new Date(eventTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const emailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Booking ${status === "confirmed" ? "Confirmed" : "Cancelled"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: ${
            status === "confirmed" ? "#28a745" : "#dc3545"
          }; text-align: center;">
            Your booking has been ${status}!
          </h2>
          
          <p>Dear ${customerName},</p>
          <p>Your booking status has been updated to <strong>${status.toUpperCase()}</strong>.</p>
          
          ${
            status === "confirmed"
              ? `
            <p>We look forward to welcoming you to the venue. Here are your updated details:</p>
            <ul>
              <li><strong>Date:</strong> ${eventDate}</li>
              <li><strong>Time:</strong> ${eventTimeFormatted}</li>
              <li><strong>Duration:</strong> ${durationHours} hours</li>
              <li><strong>Guests:</strong> ${guests}</li>
              <li><strong>Total Cost:</strong> ₨${totalCost.toLocaleString()}</li>
            </ul>
            <p>📍 Please arrive 15 minutes early. Contact the venue if you need any changes.</p>
            `
              : `<p>We're sorry to inform you that your booking has been cancelled. If this is a mistake, please contact us immediately.</p>`
          }

          <p>Best regards,<br>The Eventify Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log("📧 Booking status update email sent");
    return { success: true };
  } catch (err) {
    console.error("❌ Failed to send status update email:", err);
    throw new Error("Email sending failed");
  }
};
