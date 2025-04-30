import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { TiPencil } from "react-icons/ti";

const ToDoList = () => {
    const { isLoggedIn,  user } = useAuth(); 
    const userEmail = user?.email;

    const [toDoListTasks, setToDoListTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pop up windows for edit task
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editedTask, setEditedTask] = useState('');

    useEffect(() => {
        const fetchToDoList = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/toDoList/getUserToDoList/${userEmail}`);
                if (!response.ok) {
                    throw new Error('something went wrong, please try again later');
                }
                const data = await response.json();
                setToDoListTasks(data);
            } catch (error) {
                setError("something went wrong, couldn't fetch your To Do List, please try again later");
            } finally {
                setLoading(false);
            }
        };

        fetchToDoList();
    }, [userEmail]);

    if(!isLoggedIn){
        return (
            <div>
              <h2 className='error'>You must be logged in to view your To Do List</h2>
            </div>
        ); 
    }

    const handleAddTask = async (e) => {
        e.preventDefault();
        if(newTask.length > 64){
            setError('Task length is too long, please limit it to 64 characters');
            return;
        }
        try{
            setError(null);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/toDoList/addToDoItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: newTask,
                    userEmail: userEmail,
                }),
            });
            if (!response.ok) {
                setError('Failed to add task');
                return;
            }
            const data = await response.json();
            setToDoListTasks((prevTasks) => [...prevTasks, data]);
            setNewTask('');
        }
        catch (error) {
            setError('Failed to add task');
            setLoading(false);
            console.log(error);
        }
    }

    const handleTaskStatusChange = async (taskId) => {
        setToDoListTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/toDoList/changeToDoListItemStatus/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: toDoListTasks.find(task => task._id === taskId).completed }),
            });
            if (!response.ok) {
                throw new Error('Failed to update task status');
            }
        } catch (error) {
            setError("Failed to update task status");
        }

    }

    const handleDeleteTask = async (taskId) => {
        setToDoListTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/toDoList/deleteToDoItem/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            setError("Failed to delete task");
        }
    }

    const openEditPopUpWindow = (taskId) => {
        setShowEditPopup(true)
        setEditedTask(toDoListTasks.find(task => task._id === taskId));  
    }

    const handleEditTask = async (taskId) => {
        setToDoListTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, task: editedTask.task } : task
            )
        );
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/toDoList/updateToDoItem/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: editedTask.task }),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            setError("Failed to update task");
        } finally {
            setShowEditPopup(false);
        }
    }
    return (
        <>
            <Link to={"/profile"} style={{ textDecoration: 'none' }}>
                <button className='back-button'>Back</button>
            </Link>
            <div className='todo-list'>
                <h2>Your To-Do List</h2>
                {loading && <p className='loading'>Loading...</p>}
                {error && <p className='error'>{error}</p>}
                <div className='todo-list-container'>
                    <form onSubmit={(e) => handleAddTask(e)}>
                        <input
                            type='text'
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder='Add a new task'
                            required
                        />
                        <button type='submit'>Add</button>
                    </form>
                    {toDoListTasks.length === 0 ? (
                        <p>Your To-Do List is empty</p>
                    ) : (
                        <div className='todo-list-items'>
                            {toDoListTasks.map((task) => (
                                <div key={task._id} className='todo-list-item'>
                                    <input
                                        type='checkbox'
                                        checked={task.completed}
                                        onChange={() => handleTaskStatusChange(task._id)}
                                    />
                                    <p style={{textDecoration: task.completed ? 'line-through' : 'none'}}>{task.task}</p>
                                    <div className='edit-delete-buttons'>
                                        <MdDeleteForever className='task-action-delete' onClick={() => handleDeleteTask(task._id)}/>
                                        <TiPencil className='task-action-edit' onClick={() => openEditPopUpWindow(task._id)}/>
                                    </div>
                                </div>
                            ))}
                            {showEditPopup && (
                                <div className="modal-overlay">
                                    <div className="modal">
                                    <h3>Edit Task</h3>
                                    <label>description:</label>
                                    <input
                                        type="text"
                                        value={editedTask.task}
                                        onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
                                    />
                                    <div className="modal-buttons">
                                        <button onClick={() => handleEditTask(editedTask._id)}>Edit</button>
                                        <button onClick={() => { setShowEditPopup(false); setEditedTask(""); }}>Cancel</button>
                                    </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ToDoList;