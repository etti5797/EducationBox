import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const AddQuestion = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isLoggedIn = currentUser !== null;
  const askedBy = currentUser?.displayName || "";

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (question.length < 10) {
      setMsg("Question must be at least 10 characters long");
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      setMsg("Your question has been submitted!");
      setTitle("");
      setQuestion("");
      setTags([]);
    } catch (error) {
      console.error(error);
      setMsg("Failed to add question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="add-question">
          <Link to={"/Forum"} className="back-to-forum">
            <button className="return-btn">back</button>
          </Link>
          <form onSubmit={handleSubmit}>
            <h1>Add a Question</h1>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Tags (separated by commas)"
              value={tags.join(",")}
              onChange={(e) =>
                setTags(e.target.value.split(","))
              }
              required
            />

            <button type="submit" disabled={loading}>
              Add Question
            </button>
          </form>
            {loading && <p className="loading">Loading...</p>}
            {msg && <p className="msg">{msg}</p>}
        </div>
      ) : (
        <h1>Please login to add a question</h1>
      )}
    </>
  );
};

export default AddQuestion;
