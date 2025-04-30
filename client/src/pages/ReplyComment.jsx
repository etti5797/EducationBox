import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const ReplyComment = () => {
    const { id, answerId } = useParams(); // Get both question id and answer id from URL
    const auth = getAuth();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!auth.currentUser) {
        return (
            <div className="answer-question-page">
                <Link to={`/question/${id}`} style={{ textDecoration: 'none' }}><button className='back-button'>back</button></Link>
                <p className="error">Please log in to add a comment</p>
            </div>
        );
    }

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            if (!comment || comment.length < 10) {
                setErrorMsg("Comment must be at least 10 characters long");
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/forum/question/${id}/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                {
                    answer: comment,
                    answeredBy: auth.currentUser.displayName,
                    answeredByEmail: auth.currentUser.email,
                    parentAnswerId: answerId, 
                }),
            });
            if (!response.ok) {
                setErrorMsg("Something went wrong, please try again later");
                return;
            }
            setErrorMsg("");
            setSuccessMsg("Comment added successfully");
        } catch (error) {
            setErrorMsg("Something went wrong, please try again later");
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
            setComment("");
        }
    }

    return (
        <div className="answer-question-page">
            <Link to={`/question/${id}`} style={{ textDecoration: 'none' }}><button className='back-button'>back</button></Link>
            <div className="answer-input">
                {loading && <p className="loading">Loading...</p>}
                {errorMsg && <p className="error">{errorMsg}</p>}
                {successMsg && <p className="success">{successMsg}</p>}
                <textarea
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
                <button onClick={handleSubmit} disabled={loading}>Submit</button>
            </div>
        </div>
    );
}

export default ReplyComment;
