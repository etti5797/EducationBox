import logo from '../images/logo.PNG';
import '../styles/Style.css';

const Header = () => {
    return (
        <div className="header">
            <div className='header-left-side'>
                <img src = {logo} alt = "" />
            </div>
            <div className='header-right-side'>
                <button className='btn'>Login</button>
            </div>
        </div>
    )
};

export default Header;