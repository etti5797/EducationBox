import { BiSolidMessageAltError } from "react-icons/bi";

const NotFound = () => {
  return (
    <div className="not-found">
        < BiSolidMessageAltError className="not-found-icon"/>
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist</p>
    </div>
  );
}

export default NotFound;