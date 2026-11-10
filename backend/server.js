import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get('/', (req, res) => {
  res.send('Flashcard backend is working!');
});

app.post('/api/generate-answer', async (req, res) => {
  try{

  const question = req.body.question;

  if(!question || !question.trim()) {
    return res.status(400).json({
      error: 'Please provide a question.'
    });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: `Explain this flash card question clearly and simply in less than 50 words: ${question}`
  });

  res.json({
      answer: response.text
    });

  } catch (error) {
    console.error('Gemini error:', error);

    res.status(500).json({
      error: 'Failed to generater an answer. Please try again.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});