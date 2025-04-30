import Question from "../models/questionModel.js";
import Answer from "../models/answerModel.js";
import mongoose from "mongoose";
import { sendEmailConfirmation, sendAnswerNotification, sendCommentNotification } from "../services/emailNotification.js";
import User from "../models/userModel.js";

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
        sendEmailConfirmation(askedByEmail); 
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
        const user = await User.findOne({ email: question.askedByEmail });
        if( user != null ){
            sendAnswerNotification(question.askedByEmail, id); // Notify the user who asked the question unless he deleted his account
        }
    
        res.status(200).json({ message: "Answer submitted successfully" });
    } catch (error) {
        console.error("Error saving answer:", error);
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
        const answerCommentedOn = await Answer.findById(parentAnswerId);
        const user = await User.findOne({ email: answerCommentedOn.answeredByEmail });
        if( user ){
            sendCommentNotification(answerCommentedOn.answeredByEmail, id); // notify the user a comment was added to their answer\comment, unless he deleted his account
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error saving the comment" });
    }
}


    
