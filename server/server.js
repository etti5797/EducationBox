import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import forumRoutes from './routes/forumRoute.js';
import calendarRoutes from './routes/calendarRoute.js';
import toDoListRoutes from './routes/toDoListRoute.js';
import path from 'path'; // for deployment
import { fileURLToPath } from 'url'; // for deployment
import { dirname } from 'path'; // for deployment


const __filename = fileURLToPath(import.meta.url); // for deployment
const __dirname = dirname(__filename); // for deployment


dotenv.config();

const { MONGODB_URI } = process.env;


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


app.use("/users", userRoutes); // login + signup
app.use("/forum", forumRoutes);
app.use("/calendar", calendarRoutes);
app.use("/toDoList", toDoListRoutes); 


// for deployment
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});



