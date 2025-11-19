import crypto from "crypto";
import { ENV } from "../lib/env.js";

export const getIceServers = (req, res) => {
  const TURN_SECRET = ENV.TURN_SECRET || "default-secret";
  const TTL = 3600; // 1 hour
 
  const timestamp = Math.floor(Date.now() / 1000) + TTL;
  const username = `${timestamp}:user`;
  
  const credential = crypto
    .createHmac("sha1", TURN_SECRET)
    .update(username)
    .digest("base64");

  const iceServers = [
    {
      urls: [
        `stun:${ENV.TURN_SERVER}:3478`,
        `turn:${ENV.TURN_SERVER}:3478?transport=udp`,
        `turn:${ENV.TURN_SERVER}:3478?transport=tcp`,
      ],
      username,
      credential,
    },
  ];

  res.json({ iceServers });
};
