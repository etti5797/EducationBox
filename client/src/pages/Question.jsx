import { useParams } from "react-router-dom";

const Question = () => {
    const { id } = useParams();
  return (
    <div className="question-page">
      <h1>Question Page</h1>
      <p>Question ID: {id}</p>
    </div>
  );
}

export default Question;