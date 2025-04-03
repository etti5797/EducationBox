import Question from "../models/questionModel.js";
import Answer from "../models/answerModel.js";

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json({ message: "Questions fetched successfully", questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}