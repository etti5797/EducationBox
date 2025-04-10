import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    desctiption : {
        type: String,
        required: true,
    },
    start : {
        type: Date,
        required: true,
    },
    end : {
        type: Date,
        required: true,
    },
    userEmail : {
        type: String,
        required: true,
    },
}, { timestamps: true });

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);
export default CalendarEvent;