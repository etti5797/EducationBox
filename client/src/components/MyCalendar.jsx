import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'


const localizer = momentLocalizer(moment)

const MyCalendar = () => {
  const [events, setEvents] = useState([]) 
  const { isLoggedIn, user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isLoggedIn) {
        setEvents([]) 
        return
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/calendar/getUserEvents/${user.email}`)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()

        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [isLoggedIn, user?.email, showAddModal]) // showAddModal was added to the dependency array since the new added event wansn't displayed immediately


  const handleSelectSlot = (slotInfo) => {
    setErrorMsg('')
    setSelectedSlot(slotInfo)
    setNewTitle('')
    setNewDescription('')
    setShowAddModal(true) 
  }

  const handleSelectEvent = (event) => {
    setErrorMsg('')
    setSelectedEvent(event)
    setEditTitle(event.title)
    setEditDescription(event.description || '')
    setShowManageModal(true)
  }

  const handleAddEvent = async () => {
    if (!newTitle.trim() || !newDescription.trim())
    {
      setErrorMsg('Please fill in all fields')
      return
    }
    setErrorMsg('')
    const newEvent = {
      title: newTitle,
      description: newDescription,
      start: selectedSlot.start,
      end: selectedSlot.end,
      userEmail: user.email
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/calendar/addEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
      if (!response.ok) {
        throw new Error('Failed to add event')
      }
      const data = await response.json()
      setEvents(prevEvents => [...prevEvents, data])
      setShowAddModal(false) 
    } catch (error) {
      console.error('Error adding event:', error)
      setShowAddModal(false) 
    }
  }

  const deleteEvent = async () => { 
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/calendar/deleteEvent/${selectedEvent._id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete event')
      }
      setEvents(prevEvents => 
        prevEvents.filter((e) => 
          !(e.title === selectedEvent.title && 
            e.start.getTime() === selectedEvent.start.getTime() && 
            e.end.getTime() === selectedEvent.end.getTime())
        )
      )
      setShowManageModal(false)
    } catch (error) {
      console.error('Error deleting event:', error)
      setShowManageModal(false)
    }
  }

  const editEvent = async () => {
    if (!editTitle.trim() || !editDescription.trim()){
      setErrorMsg('Please fill in all fields')
      return
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/calendar/editEvent/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to edit event')
      }
      setEvents(prevEvents => 
        prevEvents.map((e) =>
          (e.title === selectedEvent.title && 
           e.start.getTime() === selectedEvent.start.getTime() && 
           e.end.getTime() === selectedEvent.end.getTime())
            ? { ...e, title: editTitle, description: editDescription }
            : e
        )
      )
      setShowManageModal(false) 
    } catch (error) {
      console.error('Error editing event:', error)
      setShowManageModal(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <h2 className="error">Please login to access the calendar</h2>
    )
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
          style={{ height: 500, width: '100%', backgroundColor: 'white' }}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Event</h3>
            {errorMsg && <p className="error">{errorMsg}</p>}
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
            {errorMsg && <p className="error">{errorMsg}</p>}
            <label>Edit title:</label>
            <input
              type="text"
              placeholder="Edit Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label>Edit description:</label>
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
