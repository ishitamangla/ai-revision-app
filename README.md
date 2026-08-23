# AI Interview Practice

An AI-powered web app that turns any interview questions page into an interactive practice session. Paste a URL, answer questions by typing or speaking, and get instant AI feedback on your answers.

**Live demo:** [ai-revision-app.vercel.app](https://ai-revision-9le20zcb3-ishita-manglas-projects.vercel.app)

## Features

- **URL-based question extraction** — Paste a link to any interview questions article (GeeksforGeeks, blogs, tutorials, etc.) and the app automatically extracts question-answer pairs using AI, regardless of the page's structure.
- **Voice input** — Speak your answer out loud instead of typing, using the browser's built-in speech recognition.
- **AI-powered feedback** — Every answer is evaluated by Google Gemini, which returns a score out of 10 and specific feedback on what was correct and what was missing.
- **Full practice loop** — Move through every extracted question one at a time, with your answer, the AI feedback, and the reference answer shown side by side.

## How it works

```
Start Page (paste URL)
        │
        ▼
Backend scrapes the page and sends the raw text to Gemini,
which extracts/generates proper question-answer pairs
        │
        ▼
Interview Page (shows one question at a time)
        │
        │  type or speak an answer
        ▼
Backend sends the question, reference answer, and user's
answer to Gemini for evaluation
        │
        ▼
Result Page (shows score, feedback, and reference answer)
        │
        │  next question
        ▼
Interview Page (loops until questions run out)
```

## Tech stack

**Frontend**
- React (Vite)
- React Router for navigation between pages
- Axios for API calls
- Web Speech API for voice input

**Backend**
- Node.js + Express
- Axios + Cheerio for web scraping
- Google Generative AI SDK (Gemini) for question extraction and answer evaluation

**Deployment**
- Frontend: Vercel
- Backend: Render

## Project structure

```
ai-revision-tester/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StartForm.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AnswerBox.jsx
│   │   │   ├── AnalysisCard.jsx
│   │   │   └── CorrectAnswer.jsx
│   │   ├── pages/
│   │   │   ├── StartPage.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── public/
│
└── backend/
    ├── server.js
    └── .env (not committed — holds GEMINI_API_KEY)
```

## Running locally

**Backend**
```bash
cd backend
npm install
# create a .env file with: GEMINI_API_KEY=your_key_here
node server.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend running on `http://localhost:5000`. Update the API URLs in `StartForm.jsx` and `InterviewPage.jsx` if your backend runs elsewhere.

## API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/extract` | POST | Takes a `url`, scrapes the page, and returns AI-extracted question-answer pairs |
| `/api/check-answer` | POST | Takes a `question`, `correctAnswer`, and `userAnswer`, and returns AI-generated feedback with a score |


