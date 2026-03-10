import express from "express";
import { createAgent, getAgents } from "../controllers/agentController.js";

const router = express.Router();

router.post("/", createAgent);
router.get("/", getAgents);

export default router;
