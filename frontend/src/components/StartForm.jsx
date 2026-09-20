import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function StartForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleStart = async () => {
    if (!url) {
      setError("Please paste a URL first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/extract`, {
        url: url,
      });

      const questions = response.data.questions;

      if (!questions || questions.length === 0) {
        setError("No questions found on this page");
        setLoading(false);
        return;
      }

      //give questions to revision page
      navigate("/revision", { state: { questions, currentIndex: 0 } });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check the URL and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="start-card">
      <input
        type="text"
        placeholder="Paste URL of the site"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

       <button onClick={handleStart} disabled={loading}>
        {loading ? "Loading..." : "Start Revision"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default StartForm;
