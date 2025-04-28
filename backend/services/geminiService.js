const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const getGeminiAnswer = async (question) => {
  try {
    const prompt = `
You are an Islamic Scholar AI Assistant.
Always answer Islamic (Deen) questions with authentic references (like Quran, Hadith, or classical scholars), if possible.
If you don't know, politely say: "Please consult a qualified Islamic scholar for detailed guidance."

Question: ${question}

Answer in a respectful, formal Islamic tone.
`;

    const response = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';

  } catch (error) {
    console.error('Error fetching Gemini response:', error.message);
    throw new Error('Failed to fetch from Gemini API');
  }
};

module.exports = { getGeminiAnswer };
