import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({ message: 'Unauthorized -  No token provided' });

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token provided' });
        
        const user = await User.findById(decoded.userId).select('-password');
        if(!user) return res.status(401).json({ message: 'Unauthorized - User not found' });
        
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}