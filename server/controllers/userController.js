import User from "../models/userModel.js";
import ToDoList from "../models/toDoListModel.js";
import CalendarEvent from "../models/calendarModel.js";
import Question from "../models/questionModel.js";

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
        // delete the user to-list and calendar and delete the user from the user collection,
        // but keep the questions and answers in the forum collection for the sake of the other users
        // this user will not get email notifications anymore when someone answers their question
        // or replies to their comment
        await ToDoList.deleteMany({ userEmail: email });
        await CalendarEvent.deleteMany({ userEmail: email });
        await User.findOneAndDelete({ email });
        return res.status(200).json({ message: "User deleted successfully" });
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error, user not deleted" }); 
    }
}


