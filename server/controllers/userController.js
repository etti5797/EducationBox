import User from "../models/userModel.js";

// using google sign in, saving {user name, email} in mongoDb for userCount

export const getNumUsers = async (req, res) => {
    try {
        const numUsers = await User.countDocuments();
        return res.status(200).json({ numUsers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }
}

export const addUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" }); 
        }
        const newUser = new User({ name, email });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }   
}

export const removeUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });  
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); 
    }
}


