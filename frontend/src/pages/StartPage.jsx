import StartForm from "../components/StartForm";

function StartPage() {
  return (
    <div className="start-screen">
      <h1>AI Interview Revision</h1>
      <p>
        Practice interview questions from real interview experiences and
        improve your answers with AI.
      </p>

      <StartForm />
    </div>
  );
}

export default StartPage;