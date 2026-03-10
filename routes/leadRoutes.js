import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();

// Create Lead
router.post("/", createLead);

// Get Leads with filtering
router.get("/", getLeads);

// Update lead
router.post("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

export default router;
