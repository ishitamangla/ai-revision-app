function AnalysisCard({ userAnswer, feedback }) {
  return (
    <div className="analysis-card">
      <h2>Your Answer</h2>
      <p>{userAnswer}</p>

      <h2>AI Feedback</h2>
      <p style={{ whiteSpace: "pre-line" }}>{feedback}</p>
    </div>
  );
}

export default AnalysisCard;