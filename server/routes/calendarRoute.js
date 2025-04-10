import express from 'express';
import { getUserEvents, addEvent, deleteEvent, editEvent } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/getUserEvents/:userEmail', getUserEvents);
router.post('/addEvent', addEvent);
router.delete('/deleteEvent/:id', deleteEvent);
router.put('/editEvent/:id', editEvent);

export default router;