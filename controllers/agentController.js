import SalesAgent from "../models/agentModel.js";

// --RouteLogic : Creation of Sales Agent.
export const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    //validations
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "Invalid input: 'name' is required and must be a string.",
      });
    }

    if (!email) {
      return res
        .status(400)
        .json({ error: "Invalid Input: 'email' is required." });
    }

    // --check : valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid input: 'email' must be a valid email address.",
      });
    }

    // --check : duplicate email
    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({
        error: `Sales agent with email '${email}' already exists.`,
      });
    }

    const agent = new SalesAgent({ name, email });
    const savedAgent = await agent.save();

    res.status(201).json({
      id: savedAgent._id,
      name: savedAgent.name,
      email: savedAgent.email,
      createdAt: savedAgent.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : Get all Sales Agents
export const getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find().sort({ createdAt: -1 }); // will show the newest created agent at top.

    const formatted = agents.map((agent) => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};