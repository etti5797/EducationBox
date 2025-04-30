import Question from "../models/questionModel.js";
import Answer from "../models/answerModel.js";
import mongoose from "mongoose";
// import { sendEmailConfirmation } from "../services/emailNotification.js";

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getQuestionByID = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Question not found" });
        }
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        console.log(question);
        const answers = await Answer.find({ questionId: id });
        return res.status(200).json({ question, answers });
    } catch (error) {
        console.error("Error fetching question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const addQuestion = async (req, res) => {
    const { title, question, tags, askedBy, askedByEmail } = req.body;
    try{
        const newQuestion = new Question({
            title,
            question,
            tags,
            askedBy,
            askedByEmail
        });
        await newQuestion.save();
        // sendEmailConfirmation(askedByEmail...); // need to add email to the Q model
        return res.status(201).json({ message: "Question added successfully", question: newQuestion }); 
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const addAnswer = async (req, res) => {
    const { id } = req.params; // question ID
    const { answer, answeredBy, answeredByEmail } = req.body;
    try {
        const newAnswer = new Answer({
            questionId: id,
            answer,
            answeredBy,
            answeredByEmail
        });

        await newAnswer.save();
        
        const question = await Question.findById(id);
        question.numOfAnswers += 1;
        await question.save();

        res.status(200).json({ message: "Answer submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving the answer" });
    }
};

export const addComment = async (req, res) => {
    try{
        const { id } = req.params; 
        const { answer, answeredBy, answeredByEmail, parentAnswerId } = req.body;
        const newAnswer = new Answer({
            questionId : id,
            answer,
            answeredBy,
            answeredByEmail,
            parentAnswerId,
        });
        await newAnswer.save();
        res.json(newAnswer);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error saving the comment" });
    }
}


    
