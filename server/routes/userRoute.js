import express from 'express';
import { getNumUsers, addUser, removeUser } from '../controllers/userController.js';

const router = express.Router();

/* using sign in with google */
/* only saving user name and email in mongoDb for userCount */

router.post('/addUser', addUser)
router.delete('/removeUser', removeUser); 
router.get('/', getNumUsers);

export default router;

