import { getAuth } from 'firebase/auth';
import UploadedFiles from '../components/UploadedFiles';
import { Link } from 'react-router-dom';

const Profile = () => {
  const isUserLoggedIn = getAuth().currentUser !== null;
  const userEmail = getAuth().currentUser?.email;

  return (
    <div className="profile">
      <h1>Profile</h1>
      {isUserLoggedIn ? (
        <div className="profile-content">
          <h2>Hello, {getAuth().currentUser.displayName || "User"}</h2>
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <button className="upload-files-button">Upload Files</button>
          </Link>
          {userEmail && <UploadedFiles userEmail={userEmail} />}
        </div>
      ) : (
        <div className="profile-content-blocked">
          <h2>Please log in to access your profile</h2>
        </div>
      )}
    </div>
  );
};

export default Profile;
