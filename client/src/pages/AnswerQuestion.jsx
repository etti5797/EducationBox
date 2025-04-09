import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const AnswerQuestion = () => {
    const {id} = useParams(); // question id
    const auth = getAuth();
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");


    if (!auth.currentUser) {
        return (
            <div className="answer-question-page">
                <Link to={`/question/${id}`} style={{textDecoration : 'none'}}><button className='back-button'>back</button></Link>
                <p className="error">Please log in to add an answer</p>
            </div>
        );
    }

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            if(!answer || answer.length < 10) {
                setErrorMsg("Answer must be at least 10 characters long");
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/forum/question/${id}/addAnswer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                {   answer,
                    answeredBy: auth.currentUser.displayName
                }),
            });
            if (!response.ok) {
                setErrorMsg("something went wrong, please try again later");
                return;
            }
            setErrorMsg("");
            setSuccessMsg("Answer added successfully");
        } catch (error) {
            setErrorMsg("something went wrong, please try again later");
            console.error("Error adding answer:", error);
        } finally {
            setLoading(false);
            setAnswer("");
        }
    }
    return (
        <div className="answer-question-page">
            <Link to={`/question/${id}`} style={{textDecoration : 'none'}}><button className='back-button'>back</button></Link>
            <div className="answer-input">
                {loading && <p className="loading">Loading...</p>}
                {errorMsg && <p className="error">{errorMsg}</p>}
                {successMsg && <p className="success">{successMsg}</p>}
                <textarea 
                    placeholder="Write your answer here..." 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)} 
                    required/>
                <button onClick={handleSubmit} disabled={loading}>Submit</button>
            </div>
        </div>
    );
}

export default AnswerQuestion;