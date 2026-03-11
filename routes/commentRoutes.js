import express from "express";
import { addComment, getCommentsByLead } from "../controllers/commentController.js";

const router = express.Router();

// api route : to add a comment
router.post("/leads/:id/comments", addComment);

// api route : to GET all commnets by lead
router.get("/leads/:id/comments", getCommentsByLead)

export default router;
