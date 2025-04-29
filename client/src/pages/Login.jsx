import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 
import { FcGoogle } from "react-icons/fc";


const Login = () => {

    const navigate = useNavigate();
    const auth = getAuth(); 
    const provider = new GoogleAuthProvider();

    // since 1GB storage is free, i limit the website for 6 users, each with 150MB of storage
    const USER_AMOUNT_LIMIT = 6; 

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        setError(null); 
        setIsLoading(true);
        try{
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users`);
            if(!response.ok) {
                throw new Error("Failed to fetch number of users");
            }
            const data = await response.json();
            const numUsers = data.numUsers;
            if(numUsers >= USER_AMOUNT_LIMIT) {
                setError("Maximum number of users reached. cannot create more accounts");
                setIsLoading(false);
                return;
            }
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await fetch(`${process.env.REACT_APP_SERVER_URL}/users/addUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    name: user.displayName, 
                    email: user.email 
                }),
            });
            navigate("/profile"); // redirect to profile page after successful login
        }
        catch (error) {
            console.error(error);
            setError("Failed to login. Please try again later");
            setIsLoading(false);
        }
    }

    return (
        <>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>} 
        {isLoading ? (<div className="loading">Loading...</div> ) : 
        ( 
            <div className="login">
                <button className="google-login-button" onClick={handleLogin}>
                    <FcGoogle className="google-icon" />
                    Sign in with Google
                </button>
            </div>
        )}
        </>
    );

}

export default Login;