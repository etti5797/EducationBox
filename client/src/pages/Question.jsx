import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Question = () => {
    const { isLoggedIn } = useAuth();
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleReplies, setVisibleReplies] = useState({}); // answer : are comments visible

    const toggleReplies = (answerId) => {
        setVisibleReplies(prev => ({
            ...prev,
            [answerId]: !prev[answerId]
        }));
    };

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

    const getReplies = (parentId) => {
        return answers.filter((a) => a.parentAnswerId === parentId);
    };

    const renderAnswer = (answer, level = 0) => {
        const replies = getReplies(answer._id);

        return (
            <div key={answer._id} className={`answer-details ${level > 0 ? 'reply-details' : ''}`}>
                <p>{answer.answer}</p>
                <p>
                    <strong>Answer by:</strong> {answer.answeredBy}
                    <strong> On:</strong> {new Date(answer.createdAt).toLocaleString()}
                </p>
                {isLoggedIn && <Link to={`/question/${id}/answer/${answer._id}/comment`} style={{ textDecoration: 'none' }}>
                    <button>Reply</button>
                </Link>}

                {replies.length > 0 && (
                    <button className="toogle-comments-button" onClick={() => toggleReplies(answer._id)}>
                        {visibleReplies[answer._id] ? "Hide Comments" : `See Comments (${replies.length})`}
                    </button>
                )}

                {visibleReplies[answer._id] && (
                    <div className="nested-replies">
                        {replies.map((reply) => renderAnswer(reply, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error"><p>{error}</p></div>;
    if (!question) return <div className="error">No question found with this ID</div>;

    return (
        <>
            <Link to="/forum" style={{ textDecoration: 'none' }}>
                <button className='back-button'>Back</button>
            </Link>
            <div className="question-page">
                <h2>{question.title}</h2>
                <div className="question-details">
                    <p><strong>Question:</strong> {question.question}</p>
                    <p>
                        <strong>Asked by:</strong> {question.askedBy}
                        <strong> On:</strong> {new Date(question.createdAt).toLocaleString()}
                    </p>
                </div>

                {isLoggedIn && (
                    <Link to={`/question/${id}/answer`} style={{ textDecoration: 'none' }}>
                        <button>Answer</button>
                    </Link>
                )}

                {answers.filter(a => a.parentAnswerId == null).length === 0 ? (
                    <p>No answers yet</p>
                ) : (
                    <div className="answers">
                        {answers
                            .filter((answer) => answer.parentAnswerId == null)
                            .map((answer) => renderAnswer(answer))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Question;
