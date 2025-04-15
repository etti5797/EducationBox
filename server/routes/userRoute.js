import express from 'express';
import { userLogin, userSignup, getNumUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.get('/', getNumUsers);

export default router;

