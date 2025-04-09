import { Link } from 'react-router-dom';
import logo from '../images/logo2.PNG';
import '../styles/Style.css';
import PropTypes from "prop-types";
import { IoPersonCircleOutline } from "react-icons/io5"
import Navbar from './Navbar';
import {getAuth } from 'firebase/auth';
import { useState } from 'react';

const Header = ({isLoggedIn, setIsLoggedIn, navBarOption, setNavBarOption}) => {

    const auth = getAuth();

    const handleLogout = () => {
        setIsLoggedIn(false);
        auth.signOut();
        
    }

    const [iconColor, setIconColor] = useState('rgb(39, 139, 253)');

    return (
        <div className="header">
            <div className='header-left-side'>
                <Link to={'/'}><img src = {logo} alt = "" onClick={()=>setNavBarOption("")}/></Link>
            </div>
            <div className='header-middle-side'>
                <Navbar navBarOption={navBarOption} setNavBarOption={setNavBarOption} />
            </div>
            <div className='header-right-side'>
                {!isLoggedIn && 
                    <Link to={'/login'} style={{ textDecoration: 'none' }} onClick={()=>setNavBarOption("None")} >
                        <button className='login-button'>Login</button>
                    </Link>
                }
                {isLoggedIn &&
                    <>
                        <Link to={'/profile'} style={{ textDecoration: 'none' }} onClick={()=>setNavBarOption("None")}>
                            <IoPersonCircleOutline size={45} style={{ color: iconColor, transition: 'color 0.3s ease', fontSize: '35px', marginRight: '8px', verticalAlign: 'middle' }} 
                            onMouseEnter={() => setIconColor('black')}  
                            onMouseLeave={() => setIconColor('rgb(39, 139, 253)')}/>
                        </Link>
                        <Link to={'/login'} style={{ textDecoration: 'none' }}>
                            <button className='log-out-button' onClick={()=>handleLogout()}>Log Out</button>
                        </Link>
                    </>
                }  
            </div>
        </div>
    )
};

Header.propTypes = {
    isLoggedIn: PropTypes.string.isRequired,
    setIsLoggedIn: PropTypes.func.isRequired,
    setNavBarOption: PropTypes.func.isRequired,
};

export default Header;