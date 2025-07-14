// src/controllers/authController.js
import Booking from "../models/Booking.js";
import Venue from "../models/Venue.js";

export const createBooking = async (req, res) => {
  try {
    const {
      venueId,
      customerName,
      customerNumber,
      durationHours,
      eventTime,
      guests,
      totalCost,
      status,
    } = req.body;

    // Check if venue exists
    const venueExists = await Venue.findById(venueId);
    if (!venueExists) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Create booking
    const booking = await Booking.create({
      venueId,
      customerName,
      customerNumber,
      durationHours,
      eventTime,
      guests,
      totalCost,
      status,
    });

    res.status(201).json({ message: "Booking created successfully", booking });
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

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};
