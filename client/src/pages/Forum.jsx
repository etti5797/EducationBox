import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const ForumPage = () => {
  
  const { isLoggedIn } = useAuth(); 
  const [questions, setQuestions] = useState([]);  
  const [filteredQuestions, setFilteredQuestions] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/forum/getQuestions`);
        if (!response.ok){
          throw new Error("Failed to fetch questions");  
        } 
        const data = await response.json();
        setQuestions(data);
        setFilteredQuestions(data); 
      } catch (error) {
        setMsg("Failed to load questions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          question.tags.some((tag) =>
            tag.toLowerCase().includes(e.target.value.toLowerCase())
          )
      );
      setFilteredQuestions(filtered);
    }
  };

  return (
    <div className="forum-page">
      {!isLoggedIn && <p>Notice: Only logged-in users can add questions or comment on them <br/> If you're not logged in, the buttons to perform these actions will not be visible</p>}
        {/* only logged in users can add questions*/}
      {isLoggedIn && (
        <Link to={"/add-question"}>
            <button className="add-question-btn">
            Add a Question
            </button>
        </Link> 
      )}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p className="loading">Loading questions...</p>
      ) : (
        <div className="question-list">
          {filteredQuestions.length === 0 ? (
            <p>No questions found</p>
          ) : (
            filteredQuestions.map((question) => (
              <Link className="question-card" to={`/question/${question._id}`} style={{textDecoration : 'none'}}>
                <div
                  key={question.id}
                > 
                  <h2>{question.title}</h2>
                  <p>
                    <strong>Asked by:</strong> {question.askedBy}{" "}
                    <strong>on:</strong> {new Date(question.createdAt).toLocaleString()}
                    <p>{question.numOfAnswers}{" "}replies</p>
                  </p>
                  <div className="tags">
                    {/* Render tags as a comma-separated list */}
                    {question.tags.length > 0 ? question.tags.join(", ") : "No tags"}
                  </div> 
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {msg && <p className="error">{msg}</p>}
    </div>
  );
};

export default ForumPage;
