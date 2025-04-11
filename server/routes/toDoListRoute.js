import express from 'express';
import ToDoList from '../models/toDoListModel.js';
import { getUserToDoList, addToDoItem, updateToDoItem, deleteToDoItem, changeToDoListItemStatus } from '../controllers/toDoListController.js';

const route = express.Router();
route.get('/getUserToDoList/:userEmail', getUserToDoList); 
route.post('/addToDoItem', addToDoItem); 
route.put('/updateToDoItem/:id', updateToDoItem);
route.delete('/deleteToDoItem/:id', deleteToDoItem); 
route.put('/changeToDoListItemStatus/:id', changeToDoListItemStatus); // complete or incomplete

export default route;