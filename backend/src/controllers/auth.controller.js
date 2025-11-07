import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const signup = async(req, res) => {
    const { username, email, password } = req.body;

    try {
        if(!username || !email || !password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6){
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]/
         if(!emailRegex.test(email)){
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            });
        }else{
            return res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const logout = (_, res) => {
    res.cookie('jwt', '',{
        maxAge: 0,
    });

    res.status(200).json({ message: 'Logged out successfully' });
}