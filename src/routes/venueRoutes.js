import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import {
  createVenue,
  getAllVenues,
  getUserVenues,
  getVenueById,
  editVenue,
  deleteVenue,
} from "../controllers/venueController.js";

const router = express.Router();

// multipart/form-data + protected route
router.post("/create", protect, upload.array("venueImages", 5), createVenue);
router.get("/all", getAllVenues);
router.get("/my-venues", protect, getUserVenues);
router.get("/:id", getVenueById);
router.put("/edit/:id", protect, upload.array("venueImages", 5), editVenue);
router.delete("/delete/:id", protect, deleteVenue);
export default router;
