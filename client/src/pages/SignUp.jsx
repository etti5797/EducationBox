import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    // Set initial state for form fields
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

        setIsLoading(true);

        try {
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
                navigate("/login"); 
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <>
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        {isLoading ? (<div>Loading...</div> ) : 
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
