import { RiRobot3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ChatBotIcon = ({setNavBarOption}) => {
    return (
        <Link to={'/chatBot'} style={{ textDecoration: 'none' }} onClick={() => setNavBarOption("None")}>
            <div className="chatbot-icon">
                <RiRobot3Fill color="white"/>
            </div>
        </Link>
    );
}

ChatBotIcon.propTypes = {
    setNavBarOption: PropTypes.func.isRequired,
};

export default ChatBotIcon;