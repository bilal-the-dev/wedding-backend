// src/controllers/contactController.js
import Contact from "../models/Contact.js";
import { sendContactEmail } from "../services/emailServices.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Save to database (optional)
    const contactSubmission = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip,
    });

    // Send emails
    await sendContactEmail({ name, email, message });

    // Update database record
    contactSubmission.emailSent = true;
    await contactSubmission.save();

    res.status(200).json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      success: false,
      message: "Sorry, something went wrong. Please try again later.",
    });
  }
};
