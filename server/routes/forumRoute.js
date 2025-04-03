import express from 'express';
import { getQuestions } from '../controllers/forumController';

const router = express.Router();

router.get('/getQuestions', getQuestions);

export default router;