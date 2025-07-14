import Venue from "../models/Venue.js";
import path from "path";
import fs from "fs";
export const createVenue = async (req, res) => {
  try {
    const {
      venueName,
      category,
      location,
      chargesPerHour,
      guestPerCapacity,
      amenities,
      callNumber,
      eventDescription,
    } = req.body;

    // Check all fields
    if (
      !venueName ||
      !category ||
      !location ||
      !chargesPerHour ||
      !guestPerCapacity ||
      !amenities ||
      !callNumber ||
      !eventDescription ||
      !req.files ||
      req.files.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required including images" });
    }

    const imageFilenames = req.files.map((file) => file.filename);

    const venue = await Venue.create({
      user: req.user._id,
      venueName,
      category: JSON.parse(category),
      location,
      chargesPerHour,
      guestPerCapacity,
      amenities: JSON.parse(amenities),
      callNumber,
      venueImages: imageFilenames,
      eventDescription,
    });

    res.status(201).json({ message: "Venue created successfully", venue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating venue" });
  }
};

export const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 }); // newest first
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching venues" });
  }
};

export const getUserVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user venues" });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Find relevant venues: same category, not this venue
    const relevantVenues = await Venue.find({
      _id: { $ne: venue._id }, // Exclude current venue
      category: { $in: venue.category }, // At least one category match
    })
      .limit(4)
      .select(
        "_id venueName location chargesPerHour guestPerCapacity venueImages category"
      ); // Send minimal fields

    res.json({
      venue,
      relevantVenues,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching venue" });
  }
};

export const editVenue = async (req, res) => {
  try {
    const venueId = req.params.id;

    const {
      venueName,
      category,
      location,
      chargesPerHour,
      guestPerCapacity,
      amenities,
      callNumber,
      eventDescription,
    } = req.body;

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Optional: only allow owner to edit
    if (venue.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Handle new images if provided
    let updatedImages = venue.venueImages;
    if (req.files && req.files.length > 0) {
      // Optional: delete old images
      updatedImages.forEach((img) => {
        const imgPath = path.resolve("images", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      updatedImages = req.files.map((file) => file.filename);
    }

    // Update venue
    venue.venueName = venueName || venue.venueName;
    venue.category = category ? JSON.parse(category) : venue.category;
    venue.location = location || venue.location;
    venue.chargesPerHour = chargesPerHour || venue.chargesPerHour;
    venue.guestPerCapacity = guestPerCapacity || venue.guestPerCapacity;
    venue.amenities = amenities ? JSON.parse(amenities) : venue.amenities;
    venue.callNumber = callNumber || venue.callNumber;
    venue.eventDescription = eventDescription || venue.eventDescription;
    venue.venueImages = updatedImages;

    const updated = await venue.save();

    res.json({ message: "Venue updated successfully", venue: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating venue" });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const venueId = req.params.id;

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Optional: only allow owner to delete
    if (venue.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete associated images
    venue.venueImages.forEach((img) => {
      const imgPath = path.resolve("images", img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    await venue.deleteOne();

    res.json({ message: "Venue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting venue" });
  }
};
