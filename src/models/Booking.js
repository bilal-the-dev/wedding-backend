// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: String,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
    },
    eventTime: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
