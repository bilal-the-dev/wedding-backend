import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueName: { type: String, required: true },
    category: [{ type: String, required: true }],
    location: { type: String, required: true },
    chargesPerHour: { type: Number, required: true },
    guestPerCapacity: { type: Number, required: true },
    amenities: [{ type: String, required: true }],
    callNumber: { type: String, required: true },
    venueImages: [{ type: String, required: true }],
    eventDescription: { type: String, required: true },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);
export default Venue;
