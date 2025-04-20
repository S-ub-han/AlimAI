const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

exports.getGeminiResponse = async (question) => {
  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: question }] }],
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini API error:', err.message);
    throw new Error('Failed to fetch from Gemini API');
  }
};
