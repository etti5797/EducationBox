import Question from "../models/questionModel.js";
import Answer from "../models/answerModel.js";

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const addQuestion = async (req, res) => {
    const { title, question, tags, askedBy } = req.body;
    try{
        const newQuestion = new Question({
            title,
            question,
            tags,
            askedBy
        });
        await newQuestion.save();
        return res.status(201).json({ message: "Question added successfully", question: newQuestion }); 
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}