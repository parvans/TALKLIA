import express from "express";
import { getIceServers } from "../controllers/webrtc.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/ice", protectRoute, getIceServers);

export default router;
