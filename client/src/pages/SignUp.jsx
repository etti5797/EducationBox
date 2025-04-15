import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUp = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    // since 1GB storage is free, i limit the website for 6 users, each with 150MB of storage
    const USER_AMOUNT_LIMIT = 6; // maximum number of users allowed

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        // since 1GB storage is free, i limit the website for 6 users, each with 150MB of storage
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
        }
        catch (error) {
            console.error(error);
            setError("Failed to check if user limit is reached. Please try again later");
            setIsLoading(false);
            return;
        }
        
        try {
            // Create a new user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, { displayName: name });

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            setIsLoading(false);
            if(response.status === 409) {
                setError("User already exists, please login");
            }
            if (response.status === 201) { // successful signup
                navigate("/profile"); 
            }
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Email already in use. Please login.");
            } else{
                console.error(error);
                setError("Something went wrong");
            }
            setIsLoading(false);
        }
    };

    return (
        <>
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        {isLoading ? (<div className="loading">Loading...</div> ) : 
        (
        <div className="signup">
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    Sign Up
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                    Login
                </Link>
            </p>
        </div>
        )}
        </>
    );
};

export default SignUp;
