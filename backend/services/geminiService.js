const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// SUGGESTION 1: Model ka sahi naam use karein
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const getGeminiAnswer = async (question) => {
  try {
    const prompt = `
You are an Islamic Scholar AI Assistant.
Always answer Islamic (Deen) questions with authentic references (like Quran, Hadith, or classical scholars), if possible.
If you don't know, politely say: "Please consult a qualified Islamic scholar for detailed guidance."

Question: ${question}

Answer in a respectful, formal Islamic tone.
`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      // SUGGESTION 3: Generation aur safety settings add karein
      generationConfig: {
        temperature: 0.7, // 0.0 (factual) se 1.0 (creative) tak
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048, // Response ki max length
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const response = await axios.post(
      geminiUrl,
      requestBody,
      // SUGGESTION 2: Timeout set karein (20 seconds)
      { timeout: 20000 } 
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Check karein ki kahin safety reasons se response block to nahi hua
    if (!text && response.data.candidates?.[0]?.finishReason === 'SAFETY') {
      return "I am unable to answer this question due to safety guidelines. Please ask another question.";
    }

    return text || 'Maaf kijiye, mujhe is sawaal ka jawab nahi mil paaya. Behtar hai ki aap kisi aalim se raabta karein.';

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Error: Gemini API request timed out.');
      throw new Error('The request to the AI assistant timed out. Please try again.');
    }
    console.error('Error fetching Gemini response:', error.message);
    throw new Error('Failed to fetch from Gemini API');
  }
};

module.exports = { getGeminiAnswer };
