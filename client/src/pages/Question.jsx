import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Question = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const isLoggedIn = currentUser !== null;
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/forum/getQuestion/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError("The requested question was not found");
                    } else {
                        setError("Something went wrong. Please try again later");
                    }
                } else {
                    const data = await response.json();
                    if (!data.question) {
                        setError("The requested question was not found");
                    } else {
                        setQuestion(data.question);
                        setAnswers(data.answers);
                    }
                }
            } catch (error) {
                setError("Something went wrong. Please try again later");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error"> 
                <p>{error}</p>
            </div>
        );
    }

    if (!question) {
        return <div>No question found with this ID</div>;
    }

    return (
        <div className="question-page">
            <Link to="/forum" style={{textDecoration : 'none'}}><button>Back</button></Link>
            <h1>{question.title}</h1>
            <p><strong>Question:</strong> {question.question}</p>
            <p><strong>Asked by:</strong> {question.askedBy}<strong> On:</strong> {new Date(question.createdAt).toLocaleString()}</p>
            {isLoggedIn && <Link to={`/question/${id}/answer`} style={{textDecoration : 'none'}}><button>Answer</button></Link>}
            {answers.length === 0 ? (
                <p>No answers yet</p>
            ) : (
                <div>
                    {answers.map((answer, index) => (
                        <div key={index} className="answer">
                            <p>{answer.answer}</p>
                            <p><strong>Answer by:</strong> {answer.answeredBy}<strong> On:</strong> {new Date(answer.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Question;
