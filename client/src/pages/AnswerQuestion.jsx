import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { set } from "mongoose";

const AnswerQuestion = () => {
    const {id} = useParams(); // question id
    const auth = getAuth();
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    if (!auth.currentUser) {
        return (
            <div className="answer-question-page">
                <Link to={`/question/${id}`} style={{textDecoration : 'none'}}><button>back</button></Link>
                <p>Please log in to add an answer</p>
            </div>
        );
    }

    const handleSubmit = async () => {
        setLoading(true);
        setMsg("");
        try {
            if(!answer || answer.length < 10) {
                setMsg("Answer must be at least 10 characters long");
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
                setMsg("something went wrong, please try again later");
                return;
            }
            setMsg("Answer added successfully");
        } catch (error) {
            setMsg("something went wrong, please try again later");
            console.error("Error adding answer:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="answer-question-page">
            <Link to={`/question/${id}`} style={{textDecoration : 'none'}}><button>back</button></Link>
            <input 
                type="text"
                placeholder="Write your answer here..." 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)} />
            <button onClick={handleSubmit} disabled={loading}>Submit</button>
            {loading && <p>Loading...</p>}
            {msg && <p>{msg}</p>}
        </div>
    );
}

export default AnswerQuestion;