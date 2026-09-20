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
You are given raw text extracted from a webpage. This text could be:
1. A page that already has clear question-answer pairs
2. A plain article/tutorial with headings and paragraphs explaining concepts (no explicit questions)
3. A mix of both

Your task: Generate a set of interview question-answer pairs that would help someone revise this topic — regardless of whether the source text has explicit questions or not.

IMPORTANT RULES:
- If the text already has questions, extract them as-is (keep the answer based on the given explanation).
- If the text only has headings/topic names (e.g. "Constructors", "Inheritance"), convert each into a full interview question (e.g. "What is a constructor in Java?").
- If the text is plain prose/paragraphs explaining a concept with no heading or question at all, READ the explanation and generate one or more relevant interview questions whose answers come from that paragraph's content. Do not skip content just because it isn't already phrased as a question.
- Every question must be a complete, proper interview question — never a topic name or single word.
- Answers should be clear, factually grounded in the surrounding text, and 2-4 sentences long.
- Generate between 5 and 15 questions depending on how much distinct content is in the text — don't pad with repetitive or trivial questions.

Return ONLY valid JSON, nothing else, no markdown code fences, no explanation.
Format exactly like this:
[
{"question": "...", "answer": "..."},
{"question": "...", "answer": "..."}
]

Webpage text:
${pageText}
`;
    console.log(pageText);
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