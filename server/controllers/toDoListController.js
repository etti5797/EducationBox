import ToDoList from "../models/toDoListModel.js";

export const getUserToDoList = async (req, res) => {
    try{
        const { userEmail } = req.params;
        const toDoList = await ToDoList.find({ userEmail });
        return res.status(200).json(toDoList);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const addToDoItem = async (req, res) => {
    try{
        const newToDoItem = new ToDoList(req.body);
        await newToDoItem.save();
        return res.status(201).json(newToDoItem);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateToDoItem = async (req, res) => {
    try{
        const { id } = req.params; // item id
        const upfatedToDoListItem = await ToDoList.findByIdAndUpdate(id, {
            ...req.body,
        }, { new: true });
        if (!upfatedToDoListItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json(upfatedToDoListItem);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteToDoItem = async (req, res) => {
    try{
        const { id } = req.params; 
        const deletedToDoListItem = await ToDoList.findByIdAndDelete(id);
        if (!deletedToDoListItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const changeToDoListItemStatus = async (req, res) => {
    try{
        const { id } = req.params; 
        const toDoListItem = await ToDoList.findById(id);
        if (!toDoListItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        toDoListItem.completed = !toDoListItem.completed;
        await toDoListItem.save();
        return res.status(200).json(toDoListItem);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}