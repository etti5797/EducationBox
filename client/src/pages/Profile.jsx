import { getAuth } from "firebase/auth";
import UploadFiles from "../components/UploadFiles";

const Profile = () => {
    const isUserLoggedIn = getAuth().currentUser !== null; 
    return (
        <div className="profile">
            <h1>Profile</h1>
            {isUserLoggedIn ? (
                <div className="profile-content">
                    <UploadFiles /> 
                </div>
            ) : (
                <div className="profile-content">
                    <h2>Please log in to access your profile.</h2>
                </div>
            )}
        </div>
        
    )
}

export default Profile;
