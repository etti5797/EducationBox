import express from 'express';
import { getQuestions, addQuestion } from '../controllers/forumController.js';

const router = express.Router();

router.get('/getQuestions', getQuestions);
router.post('/addQuestion', addQuestion);

export default router;