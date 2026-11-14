import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Add it to backend/.env before starting the server.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey
});

function isServiceUnavailable(error) {
  const message = error instanceof Error ? error.message : String(error);
  return error?.status === 503 || /"code"\s*:\s*503|"status"\s*:\s*"UNAVAILABLE"/.test(message);
}

app.get('/', (req, res) => {
  res.send('Flashcard backend is working!');
});

app.post('/api/generate-answer', async (req, res) => {
  try {
    const question = req.body?.question;
    if (typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        error: 'Please provide a question as a non-empty string.'
      });
    }

    const contents = `Explain this flash card question clearly and simply in less than 50 words: ${question.trim()}`;
    let response;

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents
      });
    } catch (error) {
      if (!isServiceUnavailable(error)) {
        throw error;
      }

      console.warn('gemini-3.8-flash is unavailable; trying gemini-3.6-flash.');
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents
      });
    }

    const answer = response.text?.trim();

    if (!answer) {
      console.error('Gemini returned an empty answer.');
      return res.status(502).json({
        error: 'The AI did not return an answer. Please try again.'
      });
    }

    return res.json({ answer });
  } catch (error) {
    console.error('Gemini error:', error);

    const serviceUnavailable = isServiceUnavailable(error);
    return res.status(serviceUnavailable ? 503 : 502).json({
      error: serviceUnavailable
        ? 'AI answer generation is temporarily unavailable. Please try again later.'
        : 'Failed to generate an answer. Check the backend logs and Gemini API configuration.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});