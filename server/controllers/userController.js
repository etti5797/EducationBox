import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'; 

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = await bcryptjs.compare(password, user.password)
        // bcrypt stores both the salt and the hashed password together so that it can verify the password
        if (!match) {
            return res.status(401).json({ message: "Invalid password" }); // 401 Unauthorized
        }
        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }
};

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" }); // 409 Conflict
        }
        const salt = await bcryptjs.genSalt(10) // generate a unique salt, with 10 rounds of computation
        const hash = await bcryptjs.hash(password, salt)
        const newUser = new User({ name, email, password: hash });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }
};

export const getNumUsers = async (req, res) => {
    try {
        const numUsers = await User.countDocuments();
        return res.status(200).json({ numUsers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }
}
