import { RiRobot3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

const ChatBotIcon = ({setNavBarOption}) => {
    const [iconColor, setIconColor] = useState("white");
    return (
        <Link to={'/chatBot'} style={{ textDecoration: 'none' }} onClick={() => setNavBarOption("None")}>
            <div className="chatbot-icon"
                onMouseEnter={() => setIconColor("black")}
                onMouseLeave={() => setIconColor("white")}
            >
                <RiRobot3Fill color={iconColor}/>
            </div>
        </Link>
    );
}

ChatBotIcon.propTypes = {
    setNavBarOption: PropTypes.func.isRequired,
};

export default ChatBotIcon;