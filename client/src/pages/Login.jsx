import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({setIsLoggedIn}) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        setError(null); 
        e.preventDefault();
        setIsLoading(true);
        try{
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            }); 
            setIsLoading(false);
            if (!response.ok) {
                setError("Something went wrong");
            }
            if(response.status === 404) {
                setError("You don't have an account, please sign up"); 
            }
            if(response.status === 401) {
                setError("Invalid password, please try again"); 
            }
            if(response.status === 200) {
                setError(null); 
                const data = await response.json();
                localStorage.setItem("user", JSON.stringify(data.user)); // store user data in local storage
                setIsLoggedIn(true);
                navigate('/profile'); 
            }  
        }
        catch (error) {
            console.error(error);
            setError("Something went wrong"); 
            setIsLoading(false);
        }
    }

    return (
        <>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>} 
        {isLoading ? (<div>Loading...</div> ) : 
        ( 
            <div className="login">
                <form onSubmit={handleLogin}>
                    <input type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        submit
                    </button> {/* the button is disabled when isLoading is true*/ }
                </form>
                <p>Don't have an account? 
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                    Sign Up
                    </Link>
                </p>
            </div>
        )}
        </>
    );

}

export default Login;