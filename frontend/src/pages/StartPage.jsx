import StartForm from "../components/StartForm";

function StartPage() {
  return (
    <div className="start-screen">
      <h1>RevisionMate</h1>
      <p>
        Paste a link to any article or questions page. We'll turn it into
        practice questions. Answer each one out loud or in writing, and get
        instant AI feedback on what you got right and what to improve.
      </p>

      <StartForm />
    </div>
  );
}

export default StartPage;