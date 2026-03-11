import express from "express";
import { getLeadsClosedLastWeek, getLeadsInPipeline, getClosedLeadsClosedByAgent } from "../controllers/reportController.js";

const router = express.Router();

router.get("/last-week", getLeadsClosedLastWeek);

router.get("/pipeline", getLeadsInPipeline);

router.get("/closed-by-agent", getClosedLeadsClosedByAgent);

export default router;