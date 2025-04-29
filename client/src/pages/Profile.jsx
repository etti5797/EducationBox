import UploadedFiles from '../components/UploadedFiles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteObject, getStorage, ref, listAll } from 'firebase/storage';
import { getFirestore, deleteDoc, collection, getDocs, doc } from 'firebase/firestore';


const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const userEmail = user?.email;

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const openDeleteModal = () => {
    setConfirmDeleteModal(true);
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handledeDeleteAccount = async () => {
    try{
      setConfirmDeleteModal(false);
      setLoading(true);
      setError(null);
      // delete the user files from the storage
      const storage = getStorage();
      const storageRef = ref(storage, `user_files/${userEmail}`);
      const userFiles = await listAll(storageRef); 
      await Promise.all(userFiles.items.map((fileRef) => deleteObject(fileRef)));

      // delete the meta data of the user files from firestore
      const db = getFirestore();
      const userRef = collection(db, 'users', userEmail, 'files');
      const snapshot = await getDocs(userRef);
      await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
      const userDocRef = doc(db, 'users', userEmail);
      await deleteDoc(userDocRef);

      
      // delete the user from firebase - delete the auth user
      await user.delete(); 

      // delete the user from mongoDB
      await fetch(`${process.env.REACT_APP_SERVER_URL}/users/removeUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      }
      );
    }
    catch (error) {
      console.error(error);
      setError("Failed to delete account. Please try again later");
    }
  }


  return (
    <div className="profile">
      {isLoggedIn ? (
        <div className="profile-content">
          <div className='delete-account'>
            <button className="delete-account-button" onClick={openDeleteModal}>
                Delete Account
              </button>
          </div>
          <h2>Hello {user.displayName || "User"}</h2>
          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">deleting your account...</p>}
          <div className='profile-buttons'>
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <button className="upload-files-button">Upload Files</button>
            </Link>
            <Link to="/myCalendar" style={{ textDecoration: 'none' }}>
              <button className="calendar-button">View Calendar</button>
            </Link>
            <Link to="/todo-list" style={{ textDecoration: 'none' }}>
              <button className="todo-list-button">View To-Do List</button>
            </Link>
          </div>
          {userEmail && <UploadedFiles userEmail={userEmail} />}

          {confirmDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Are you sure you want to delete your account?</h3>
              <p>Please note that all the files associated with your account will be permanently deleted</p>
              <div className='modal-buttons'>
                <button onClick={handledeDeleteAccount}>Delete</button>
                <button onClick={() => setConfirmDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        </div>
      ) : (
        <div className="error">
          <h2>Please log in to access your profile</h2>
        </div>
      )}
    </div>
  );
};

export default Profile;
