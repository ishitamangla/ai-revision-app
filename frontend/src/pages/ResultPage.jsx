import { useLocation, useNavigate } from "react-router-dom";
import AnalysisCard from "../components/AnalysisCard";
import CorrectAnswer from "../components/CorrectAnswer";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const userAnswer = location.state?.userAnswer || "No answer submitted";
  const correctAnswer = location.state?.correctAnswer || "No answer available";
  const feedback = location.state?.feedback || "No feedback available";
  const questions = location.state?.questions || [];
  const currentIndex = location.state?.currentIndex || 0;

  const isLastQuestion = currentIndex >= questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      navigate("/");
      return;
    }

    navigate("/interview", {
      state: {
        questions,
        currentIndex: currentIndex + 1,
      },
    });
  };

  return (
    <div className="result-screen">
      <AnalysisCard userAnswer={userAnswer} feedback={feedback} />
      <CorrectAnswer answer={correctAnswer} />

      <button onClick={handleNext}>
        {isLastQuestion ? "Finish (Back to Start)" : "Next Question"}
      </button>
    </div>
  );
}

export default ResultPage;