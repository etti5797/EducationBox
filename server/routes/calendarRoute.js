import express from 'express';
import { getEvents, addEvent, deleteEvent, editEvent } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/getEvents', getEvents);
router.post('/addEvent', addEvent);
router.delete('/deleteEvent/:id', deleteEvent);
router.put('/editEvent/:id', editEvent);

export default router;