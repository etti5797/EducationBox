import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 


const Login = ({setIsLoggedIn}) => {

    const navigate = useNavigate();
    const auth = getAuth(); 

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
            if (!response.ok) {
                setError("Something went wrong");
                setIsLoading(false);
            }
            if(response.status === 404) {
                setError("You don't have an account, please sign up"); 
                setIsLoading(false);
            }
            if(response.status === 401) {
                setError("Invalid password, please try again");
                setIsLoading(false); 
            }
            if(response.status === 200) {
                setError(null); 
                await signInWithEmailAndPassword(auth, email, password);  //sign in the user in the firebase auth system 
                setIsLoggedIn(true);
                setIsLoading(false);
                navigate('/profile'); 
            }  
        }
        catch (error) {
            console.error(error);
            if(error.code === "auth/user-not-found") {
                setError("You don't have an account, please sign up"); 
            }
           else{
                setError("Something went wrong");
           }
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