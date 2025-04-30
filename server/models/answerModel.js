import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    answeredBy: {
        type: String,
        required: true,
    },
    answeredByEmail: {
        type: String,
        required: true,
    },
    parentAnswerId: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Answer', 
        default: null,  // no parent = answer to the question
                        // having parent = comment to the answer
    },
}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
