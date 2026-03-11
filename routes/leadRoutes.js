import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();

// Create Lead
router.post("/", createLead);

// Get Leads with filtering
router.get("/", getLeads);

// Get Lead by Id
router.get("/:id", getLeadById);

// Update lead
router.post("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

export default router;
