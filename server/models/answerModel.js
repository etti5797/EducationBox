import mongoose from "mongoose"

const answerSchema = new mongoose.Schema({
    questionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    answer : {
        type: String,
        required: true,
    },
    answeredBy : {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;