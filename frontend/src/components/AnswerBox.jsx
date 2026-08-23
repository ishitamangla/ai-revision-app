import { useState, useRef } from "react";

function AnswerBox({ onCheck }) {
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleCheck = () => {
    onCheck(answer);
  };

  const toggleListening = () => {
    // Browser support check
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="answer-box">
      <textarea
        placeholder="Type your answer here, or use the mic..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
      />

      <div className="answer-box-actions">
        <button
          type="button"
          onClick={toggleListening}
          className={isListening ? "mic-button listening" : "mic-button"}
        >
          {isListening ? "Stop Listening" : "Speak Answer"}
        </button>

        <button onClick={handleCheck}>Check Answer</button>
      </div>
    </div>
  );
}

export default AnswerBox;