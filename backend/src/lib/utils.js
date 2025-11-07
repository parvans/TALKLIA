import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = process.env;
    if(!JWT_SECRET){
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({userId}, JWT_SECRET,{
        expiresIn:'7d'
    });

    res.cookie('jwt', token, {
        mxAge: 7 * 24 * 60 * 60 * 1000, // 7 days   MS
        httpOnly: true, // prevent XSS attacks: cross site scripting
        sameSite: "strict", // CSRF protection: cross site request forgery
        secure: ENV.NODE_ENV === 'development'? false : true // only send cookie over https in production
    });

    return token;
    
}