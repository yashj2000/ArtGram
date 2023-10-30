import express from "express";
import { getFeedEvents, getUserEvents, rsvpEvent, commentEvent } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";
import { get } from "mongoose";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedEvents);
router.get("/:userId/events", verifyToken, getUserEvents);

/* UPDATE */
router.patch("/:id/like", verifyToken, rsvpEvent);
router.post("/:id/comment", verifyToken, commentEvent); // Add the comment route

export default router;