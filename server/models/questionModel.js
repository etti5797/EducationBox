import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    question : {
        type: String,
        required: true,
    },
    tags : {
        type: [String],
        required: true,
    },
    askedBy : {
        type: String,
        required: true,
    },
    numOfAnswers : {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;