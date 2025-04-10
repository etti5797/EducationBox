import { Link } from "react-router";
import PropTypes from "prop-types";
import '../styles/Style.css';

const Navbar = ({navBarOption, setNavBarOption}) => {
    return (
        <div className="navbar">
            <ul className="navber-options">  
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <li className="navbar-option" onClick={() => setNavBarOption("")}>Home</li>
                    {navBarOption === "" && <hr />}
                </Link>
                <Link to="/forum" style={{ textDecoration: 'none' }}>
                    <li className="navbar-option" onClick={() => setNavBarOption("Forum")}>Forum</li>
                    {navBarOption === "Forum" && <hr />}
                </Link>
                <Link to="/shared-materials" style={{ textDecoration: 'none' }}>
                    <li className="navbar-option" onClick={() => setNavBarOption("Shared Materials")}>Shared Materials</li>
                    {navBarOption === "Shared Materials" && <hr />}
                </Link>
            </ul>
        </div>
    )

}

Navbar.propTypes = {
    navBarOption: PropTypes.string.isRequired,
    setNavBarOption: PropTypes.func.isRequired,
};

export default Navbar;