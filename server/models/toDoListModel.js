import mongoose from "mongoose"

const toDoListSchema = new mongoose.Schema({
    task : {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
        required: true,
    },
    userEmail : {
        type: String,
        required: true,
    },
}, {Timestamp : true});

const ToDoList = mongoose.model('ToDoList', toDoListSchema);
export default ToDoList;