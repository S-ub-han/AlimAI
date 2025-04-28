const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const franc = require('franc-min');

// Initialize Google Translate API
const translate = new Translate();

// Function to detect language
const detectLanguage = (text) => {
  return franc(text);
};

// Function to translate text to desired language
const translateText = async (text, targetLang) => {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.error('Translation Error:', err);
    return text;
  }
};

// APIs URLs
const QURAN_API_URL = 'https://api.alquran.cloud/v1/';
const HADITH_API_URL = 'https://raw.githubusercontent.com/fawazahmed0/hadith-api/main/json/';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Fetch from Quran API
const getQuranResponse = async (question) => {
  try {
    const response = await axios.get(`${QURAN_API_URL}search?q=${encodeURIComponent(question)}`);
    if (response.data.data && response.data.data.length > 0) {
      const firstMatch = response.data.data[0];
      return {
        text: firstMatch.text,
        reference: `${firstMatch.surah} ${firstMatch.ayah}`,
        source: 'Quran'
      };
    }
    return null;  // If no result found
  } catch (err) {
    console.error('Error fetching Quran response:', err.message);
    return null;  // If error occurs, fallback to other sources
  }
};

// Fetch from Hadith API
const getHadithResponse = async (question) => {
  try {
    const response = await axios.get(`${HADITH_API_URL}${encodeURIComponent(question)}.json`);
    if (response.data && response.data.length > 0) {
      // Multiple Hadiths handling
      const hadiths = response.data.slice(0, 3).map(hadith => ({
        text: hadith.text,
        reference: `Hadith No. ${hadith.number} (${hadith.book})`,
        source: 'Hadith'
      }));
      return hadiths;
    }
    return null;  // If no result found
  } catch (err) {
    console.error('Error fetching Hadith response:', err.message);
    return null;  // If error occurs, fallback to Gemini
  }
};

// Fetch from Gemini API
const getGeminiResponse = async (question) => {
  try {
    const response = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: question }] }],
    });
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini API error:', err.message);
    throw new Error('Failed to fetch from Gemini API');
  }
};

// Main function to get response from all APIs in order
exports.getResponse = async (question) => {
  // Detect language
  const lang = detectLanguage(question);

  // Try to fetch from Quran API
  let answer = await getQuranResponse(question);
  if (answer) {
    // If answer found, translate if necessary
    if (lang !== 'urd') {
      answer.text = await translateText(answer.text, 'ur');
    }
    return { text: answer.text, source: answer.source, reference: answer.reference };
  }

  // Try to fetch from Hadith API if Quran doesn't give a response
  answer = await getHadithResponse(question);
  if (answer) {
    // Multiple Hadiths found, return them as points with references
    if (lang !== 'urd') {
      for (let i = 0; i < answer.length; i++) {
        answer[i].text = await translateText(answer[i].text, 'ur');
      }
    }
    return { text: answer, source: 'Hadith', reference: 'Multiple references found' };
  }

  // Fall back to Gemini if no Quran or Hadith result
  answer = await getGeminiResponse(question);
  // Translate if necessary
  if (lang !== 'urd') {
    answer = await translateText(answer, 'ur');
  }
  return { text: answer, source: 'Gemini AI', reference: 'No reference available' };
};
