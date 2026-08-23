import StartForm from "../components/StartForm";

function StartPage() {
  return (
    <div className="start-screen">
      <h1>Revise with AI</h1>
      <p>
        Paste a link to any interview questions page. Answer each one out loud
        or in writing, and get instant AI feedback on what you got right and
        what to improve.
      </p>

      <StartForm />
    </div>
  );
}

export default StartPage;