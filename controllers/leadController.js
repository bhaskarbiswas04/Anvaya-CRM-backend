import mongoose from "mongoose";
import Lead from "../models/leadModel.js";
import SalesAgent from "../models/agentModel.js";

const VALID_STATUS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed",
];

const VALID_PRIORITY = ["High", "Medium", "Low"];

const VALID_SOURCE = [
  "Website",
  "Referral",
  "Cold Call",
  "Advertisement",
  "Email",
  "Other",
];

// --RouteLogic : Creation of New Lead
export const createLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    //Validations
    if (
      !name ||
      !VALID_SOURCE.includes(source) ||
      !VALID_STATUS.includes(status) ||
      !VALID_PRIORITY.includes(priority)
    ) {
      return res.status(400).json({
        error: "Invalid input: Try Again!",
      });
    }

    if (!Number.isInteger(timeToClose) || timeToClose <= 0) {
      return res.status(400).json({
        error: "Invalid input: 'timeToClose' must be a positive integer.",
      });
    }

    // Validate SalesAgent
    if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({
        error: "Invalid Sales Agent ID.",
      });
    }

    const agent = await SalesAgent.findById(salesAgent);

    if (!agent) {
      return res.status(404).json({
        error: `Sales agent with ID '${salesAgent}' not found.`,
      });
    }

    // creating new lead after all the validation checks.
    const lead = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });

    if (status === "Closed") {
      lead.closedAt = new Date();
    }

    const savedLead = await lead.save();

    const populatedLead = await Lead.findById(savedLead._id).populate(
      "salesAgent",
      "name",
    );

    res.status(201).json({
      id: populatedLead._id,
      name: populatedLead.name,
      source: populatedLead.source,
      salesAgent: {
        id: populatedLead.salesAgent._id,
        name: populatedLead.salesAgent.name,
      },
      status: populatedLead.status,
      tags: populatedLead.tags,
      timeToClose: populatedLead.timeToClose,
      priority: populatedLead.priority,
      createdAt: populatedLead.createdAt,
      updatedAt: populatedLead.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : GET all Leads
export const getLeads = async (req, res) => {
  try {
    const { salesAgent, source, status, tags } = req.query;

    const filter = {};

    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return res.status(400).json({
          error: "Invalid salesAgent ID.",
        });
      }

      filter.salesAgent = salesAgent;
    }

    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return res.status(400).json({
          error: "Invalid status value.",
        });
      }

      filter.status = status;
    }

    if (source) {
      if (!VALID_SOURCE.includes(source)) {
        return res.status(400).json({
          error: "Invalid source value.",
        });
      }

      filter.source = source;
    }

    if (tags) {
      filter.tags = { $in: [tags] };
    }

    const leads = await Lead.find(filter)
      .populate("salesAgent", "name")
      .sort({ createdAt: -1 });

    const formattedLeads = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      source: lead.source,
      salesAgent: {
        id: lead.salesAgent._id,
        name: lead.salesAgent.name,
      },
      status: lead.status,
      tags: lead.tags,
      timeToClose: lead.timeToClose,
      priority: lead.priority,
      createdAt: lead.createdAt,
    }));
    res.status(200).json(formattedLeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : GET Lead By ID
export const getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        error: "Invalid Lead ID.",
      });
    }

    const lead = await Lead.findById(leadId).populate("salesAgent", "name");

    if (!lead) {
      return res.status(404).json({
        error: `Lead with ID '${leadId}' not found.`,
      });
    }

    res.status(200).json({
      id: lead._id,
      name: lead.name,
      source: lead.source,
      salesAgent: {
        id: lead.salesAgent._id,
        name: lead.salesAgent.name,
      },
      status: lead.status,
      tags: lead.tags,
      timeToClose: lead.timeToClose,
      priority: lead.priority,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : Update a Lead Details
export const updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        error: "Invalid Lead ID.",
      });
    }

    const existingLead = await Lead.findById(leadId);

    if (!existingLead) {
      return res.status(404).json({
        error: `Lead with ID '${leadId}' not found.`,
      });
    }

    const { name, source, status, tags, timeToClose, priority } = req.body;

    Object.assign(existingLead, {
      name,
      source,
      status,
      tags,
      timeToClose,
      priority,
    });

    if (status === "Closed") {
      existingLead.closedAt = new Date();
    }

    await existingLead.save();

    const populatedLead = await Lead.findById(leadId).populate(
      "salesAgent",
      "name",
    );

    res.status(200).json({
      id: populatedLead._id,
      name: populatedLead.name,
      source: populatedLead.source,
      salesAgent: {
        id: populatedLead.salesAgent._id,
        name: populatedLead.salesAgent.name,
      },
      status: populatedLead.status,
      tags: populatedLead.tags,
      timeToClose: populatedLead.timeToClose,
      priority: populatedLead.priority,
      createdAt: populatedLead.createdAt,
      updatedAt: populatedLead.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : Delete a Lead
export const deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({
        error: "Invalid Lead ID.",
      });
    }

    const deletedLead = await Lead.findByIdAndDelete(leadId);

    if (!deletedLead) {
      return res.status(404).json({
        error: `Lead with ID '${leadId}' not found.`,
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};