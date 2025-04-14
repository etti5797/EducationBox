import Child from "../models/childModel.js";
import Table from "../models/tableModel.js"; 

export const getUserChildren = async (req, res) => {
    try {
        const { userEmail } = req.params;
        const children = await Child.find({ userEmail });
        return res.status(200).json(children);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const createChild = async (req, res) => {
    try {
        const { userEmail, childName, childGender } = req.body;
        const newChild = new Child({
            userEmail,
            childName,
            childGender
        });
        await newChild.save();
        return res.status(201).json(newChild);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteChild = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedChild = await Child.findByIdAndDelete(id);
        if (!deletedChild) {
            return res.status(404).json({ message: "Child not found" });
        }

        // Delete all tables related to this child
        await Table.deleteMany({ childId: id });
        return res.status(200).json({ message: "Child and associated tables deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}
