import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";


export const socketAuthMiddleare = async(socket, next) => {
    try {
        // token
        const token = socket.handshake.headers.cookie
        ?.split(';')
        .find((row)=>row.startsWith('jwt='))
        ?.split('=')[1];

        if(!token){
            console.log("Socket connection rejcted due to no token");
            return next(new Error('Unauthorized - No token provided'));
        }

        // verify
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            console.log("Socket connection rejcted due to invalid token");
            return next(new Error('Unauthorized - Invalid token provided'));
        }

        // find User
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            console.log("Socket connection rejcted due to user not found");
            return next(new Error('Unauthorized - User not found'));
        }

        // attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();
        next();
    } catch (error) {
        console.error('Socket Auth Middleware Error:', error);
        next(new Error('Internal server error'));
    }
}