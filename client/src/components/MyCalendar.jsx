import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const localizer = momentLocalizer(moment)

const MyCalendar = () => {
  const [events, setEvents] = useState([]) 
  const [showAddModal, setShowAddModal] = useState(false) // for add event (pop up window)
  const [showManageModal, setShowManageModal] = useState(false) // for edit or delete event (pop up window)
  const [selectedEvent, setSelectedEvent] = useState(null) 
  const [selectedSlot, setSelectedSlot] = useState(null) 
  const [newTitle, setNewTitle] = useState('') 
  const [newDescription, setNewDescription] = useState('') 
  const [editTitle, setEditTitle] = useState('') 
  const [editDescription, setEditDescription] = useState('') 

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo)
    setNewTitle('')
    setNewDescription('')
    setShowAddModal(true) // open the add modal
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setEditTitle(event.title)
    setEditDescription(event.description || '')
    setShowManageModal(true) // open the manage modal
  }

  const handleAddEvent = () => {
    if (!newTitle.trim()) return 
    const newEvent = {
      title: newTitle,
      description: newDescription,
      start: selectedSlot.start,
      end: selectedSlot.end,
    }
    setEvents([...events, newEvent]) 
    setShowAddModal(false) // Close the add modal
  }

  const deleteEvent = () => {
    setEvents(events.filter((e) =>
      !(e.title === selectedEvent.title &&
        e.start.getTime() === selectedEvent.start.getTime() &&
        e.end.getTime() === selectedEvent.end.getTime())
    )) 
    setShowManageModal(false) // Close the manage modal
  }

  const editEvent = () => {
    if (!editTitle.trim()) return 
    setEvents(events.map((e) =>
      (e.title === selectedEvent.title && e.start.getTime() === selectedEvent.start.getTime() && e.end.getTime() === selectedEvent.end.getTime())
        ? { ...e, title: editTitle, description: editDescription }
        : e
    )) 
    setShowManageModal(false) // Close the manage modal
  }

  return (
    <div className="calendar-page-container">
      <Link to="/profile" style={{ textDecoration: 'none' }}>
        <button className="back-button">Back</button>
      </Link>
      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          views={['month', 'week', 'day']}
          defaultView="month"
          defaultDate={new Date()}
          popup={true}
          style={{ height: 500, width: 600, margin: '20px auto', backgroundColor: 'white' }}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {/* Add Event Modal (pop up window) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Event Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div className='modal-buttons'>
              <button onClick={handleAddEvent}>Save</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Event Modal */}
      {showManageModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Or Delete Event</h3>
            <label>edit title:</label>
            <input
              type="text"
              placeholder="Edit Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label>edit description:</label>
            <textarea
              placeholder="Edit Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className='modal-buttons'>
              <button onClick={editEvent}>Edit</button>
              <button onClick={deleteEvent}>Delete</button>
              <button onClick={() => setShowManageModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCalendar
