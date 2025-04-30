import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const AddQuestion = () => {
  const { isLoggedIn, user } = useAuth();
  const askedBy = user?.displayName || "";
  const askedByEmail = user?.email || "";

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (question.length < 10) {
      setErrorMsg("Question must be at least 10 characters long");
      return;
    }

    setLoading(true);

    try {
      const tagsWithoutSpaces = tags.map((tag) => tag.trim().toLowerCase()).filter((tag) => tag !== "");
      setTags(tagsWithoutSpaces);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/forum/addQuestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            question,
            tags,
            askedBy,
            askedByEmail
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      setErrorMsg(null);

      setSuccessMsg("Your question has been submitted!");
      setTitle("");
      setQuestion("");
      setTags([]);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to add question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="add-question-page">
          <Link to={"/forum"} className="back-button">
            <button className='back-button'>back</button>
          </Link>
          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}
          <form onSubmit={handleSubmit}>
            <h2>Add a Question</h2>
            <div className="question-input">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            </div>
            <div className="question-input">
            <textarea
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            </div>
            <div className="question-input">
            <input
              type="text"
              placeholder="Tags (separated by commas)"
              value={tags.join(",")}
              onChange={(e) =>
                setTags(e.target.value.split(","))
              }
              required
            />
            </div>

            <button type="submit" disabled={loading}>
              Add Question
            </button>
            {loading && <p className="loading">Loading...</p>}
          </form>
        </div>
      ) : (
        <h1 className="error">Please login to add a question</h1>
      )}
    </>
  );
};

export default AddQuestion;
