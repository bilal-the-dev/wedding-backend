// src/controllers/authController.js
import Booking from "../models/Booking.js";
import Venue from "../models/Venue.js";
import {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
} from "../services/emailServices.js";

export const createBooking = async (req, res) => {
  try {
    const {
      venueId,
      customerName,
      customerEmail,
      customerNumber,
      durationHours,
      eventTime,
      guests,
      totalCost,
      status,
    } = req.body;

    // Validate required fields
    if (!customerEmail) {
      return res.status(400).json({ message: "Customer email is required" });
    }

    // Check if venue exists and populate owner info
    const venue = await Venue.findById(venueId).populate("user", "name email");
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Create booking
    const booking = await Booking.create({
      venueId,
      customerName,
      customerEmail,
      customerNumber,
      durationHours,
      eventTime,
      guests,
      totalCost,
      status,
    });

    // Send booking confirmation emails
    try {
      await sendBookingConfirmationEmail(
        {
          customerName,
          customerEmail,
          customerNumber,
          guests,
          eventTime,
          durationHours,
          totalCost,
        },
        {
          venueName: venue.venueName,
          location: venue.location,
          chargesPerHour: venue.chargesPerHour,
          callNumber: venue.callNumber,
        },
        {
          name: venue.user.name,
          email: venue.user.email,
        }
      );

      // Update booking to mark email as sent
      booking.emailSent = true;
      await booking.save();
    } catch (emailError) {
      console.error(
        "Email sending failed, but booking was created:",
        emailError
      );
      // Don't fail the booking creation if email fails
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      emailSent: booking.emailSent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getBookingsByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    // Check if venue exists
    const venueExists = await Venue.findById(venueId);
    if (!venueExists) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Get bookings for venue
    const bookings = await Booking.find({ venueId }).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    if (["confirmed", "cancelled"].includes(status)) {
      try {
        await sendBookingStatusUpdateEmail(booking);
      } catch (emailError) {
        console.error("Email failed to send for status update:", emailError);
        // Do not block the response if email fails
      }
    }
    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};
