import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import forumRoutes from './routes/forumRoute.js';
import calendarRoutes from './routes/calendarRoute.js';


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


app.use("/users", userRoutes); 
app.use("/forum", forumRoutes);
app.use("/calendar", calendarRoutes);