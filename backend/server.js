require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Route 1: extracting questions from url
app.post("/api/extract", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
  
    $("script, style, nav, footer, header").remove();
    let pageText = $("body").text();

    // cleaning extra whitespace 
    pageText = pageText.replace(/\s+/g, " ").trim();

   // limiting the size
    const MAX_CHARS = 30000;
    if (pageText.length > MAX_CHARS) {
      pageText = pageText.substring(0, MAX_CHARS);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `
    You are given raw text extracted from a webpage containing interview questions and answers.

    Extract or generate interview question-answer pairs from this text.

    IMPORTANT RULES:
    - Every question must be phrased as a complete, proper interview question (e.g., "What is a constructor in Java?" or "Explain the use of constructors in Java."), NEVER just a topic name or single word like "Constructor".
    - If the source text only has a heading/topic name (not a full question), rewrite it into a proper question using that topic.
    - Answers should be clear and based on the surrounding content.

    Return ONLY valid JSON, nothing else, no markdown code fences, no explanation.
    Format exactly like this:
    [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
    ]

    Webpage text:
    ${pageText}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // cleaning the response to ensure it's valid JSON
    responseText = responseText.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse failed:", responseText.substring(0, 500));
      return res.status(500).json({ error: "AI response could not be parsed" });
    }

    res.json({ count: questions.length, questions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to extract questions" });
  }
});

// Route 2: checking th answer of user by ai
app.post("/api/check-answer", async (req, res) => {
  try {
    const { question, correctAnswer, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: "Question and userAnswer are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `
You are an interview coach. Evaluate the candidate's answer.

Question: ${question}

Ideal/Reference Answer: ${correctAnswer}

Candidate's Answer: ${userAnswer}

Give feedback in this exact format:
Score: (a number out of 10)
Feedback: (2-3 sentences on what was good and what was missing)
`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({ feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get AI feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});