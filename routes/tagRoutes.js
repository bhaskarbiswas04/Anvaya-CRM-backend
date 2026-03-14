import express from "express";
import { getTags, createTags } from "../controllers/tagController.js"

const router = express.Router();

router.get("/", getTags);
router.post("/", createTags);

export default router;