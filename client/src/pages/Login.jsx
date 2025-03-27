import { useNavigate } from "react-router-dom";
const Login = ({setIsLoggedIn}) => {

    const navigate = useNavigate();

    const handleLogin = () => {
        // need to prevent empty login- for now its fake- immediately logs in
        // no sign up page yet
        setIsLoggedIn(true);
        navigate('/profile');   
    }

    return (
        <div className="login">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={() => handleLogin()}>Login</button>
            <p>Don't have an account yet?</p>
            <button>Sign Up</button> {/*to do - link to a signup page*/ }

        </div>
    );
}

export default Login;