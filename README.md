# Flashcards

A study app for writing your own flashcards and quizzing yourself. An optional AI button suggests answers through a small backend.

## Features

- Add a question and an answer, or let the AI suggest one
- Browse cards with numbers, and expand the list when there are two or more
- Delete any card, and the numbers update automatically
- Quiz yourself with Reveal, Skip, and Return
- Cards are saved in your browser, so they remain after a refresh

## Project structure

flash_cards/
├── frontend/
│   ├── images/
│   ├── script/
│   │   ├── main.js
│   │   └── testing.js
│   ├── styles/
│   │   ├── general.css
│   │   ├── main.css
│   │   └── testing.css
│   ├── index.html
│   └── testing.html
└── backend
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── server.js
## Requirements

- [Node.js](https://nodejs.org/) (for the backend)
- [VS Code](https://code.visualstudio.com/) with the Live Server extension (for the frontend)

## Running the app

### Frontend

1. Open the frontend/ folder in VS Code.
2. Right-click index.html and choose Open with Live Server.

The app works without the backend. Only the AI button needs it

### Backend

1. Open a terminal in the backend/ folder.
2. Run npm install. You only need this the first time.
3. Put any secret values, such as an API key, in .env.
4. Run node server.js. The server runs at http://localhost:3000.

## AI endpoint

The AI button sends a POST request to http://localhost:3000/api/generate-answer with this JSON body:

{ "question": "what is HTML" }
The server replies with { "answer": "..." }, or { "error": "..." } if something fails.

The frontend runs on a different port from the backend, so the server must allow cross-origin requests. Install the cors package and add app.use(cors()) in server.js before your routes.

## How to use

1. Type a question and click Add.
2. Write an answer, or click the AI button and edit the result.
3. Click Submit to save the card.
4. Click Done to open the quiz page.
5. On the quiz page, use Reveal, Skip, or Return. Use Add question to go back and create more cards.
6. Click Reset to delete all cards.

## Troubleshooting

| Problem | Fix |
|---|---|
| The page has no styling | Check the stylesheet links. general.css must load before testing.css. |
| The AI button stays on "Generating..." | Start the backend, then check the Console tab (F12). |
| A CORS error appears | Enable CORS on the backend, as described above. |
| Cards disappear after a refresh | Open the page from the same address each time. localhost and 127.0.0.1 store data separately. |
| Done does nothing | Add at least one card first. |

## Tech stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js and Express
- **AI answers:** Google Gemini API (`@google/genai`)
- **Card storage:** Browser `localStorage`
- **Frontend development:** VS Code Live Server

nodejs.org (https://nodejs.org/)
