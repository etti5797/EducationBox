import express from 'express';
import { getQuestions, addQuestion, getQuestionByID, addAnswer } from '../controllers/forumController.js';

const router = express.Router();

router.get('/getQuestions', getQuestions);
router.get('/getQuestion/:id', getQuestionByID); //this include getting answers for the question
router.post('/addQuestion', addQuestion);
router.post('/question/:id/addAnswer', addAnswer);

export default router;