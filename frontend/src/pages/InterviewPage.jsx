import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const questions = location.state?.questions || [];
  const currentIndex = location.state?.currentIndex || 0;

  if (questions.length === 0) {
    return (
      <div className="interview-screen">
        <p>No questions found. Please start again.</p>
        <button onClick={() => navigate("/")}>Go to Start</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleCheck = async (userAnswer) => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/check-answer", {
        question: currentQuestion.question,
        correctAnswer: currentQuestion.answer,
        userAnswer: userAnswer,
      });

      navigate("/result", {
        state: {
          userAnswer,
          correctAnswer: currentQuestion.answer,
          feedback: response.data.feedback,
          questions,
          currentIndex,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to get AI feedback. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="interview-screen">
      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>
      <QuestionCard question={currentQuestion.question} />
      <AnswerBox onCheck={handleCheck} />

      {loading && <p>Getting AI feedback, please wait...</p>}
    </div>
  );
}

export default InterviewPage;