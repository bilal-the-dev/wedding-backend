// src/routes/authRoutes.js
import express from "express";
import {
  createBooking,
  getBookingsByVenue,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/venue/:venueId", getBookingsByVenue);
router.patch("/status/:bookingId", updateBookingStatus);
export default router;
