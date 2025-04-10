import CalendarEvent from "../models/calendarModel";


// need to change for a specific user
export const getEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.find();
        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const addEvent = async (req, res) => {
    const { title, description, start, end, userEmail } = req.body;
    try {
        const newEvent = new CalendarEvent({
            title,
            description,
            start,
            end,
            userEmail
        });
        await newEvent.save();
        return res.status(201).json({ message: "Event added successfully", event: newEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await CalendarEvent.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

// userEmail??
export const editEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, start, end } = req.body;
    try {
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(id, {
            title,
            description,
            start,
            end
        }, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

