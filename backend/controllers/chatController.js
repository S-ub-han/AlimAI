const { getGeminiAnswer } = require('../services/geminiService');

const askQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    const answer = await getGeminiAnswer(question);
    res.json({
      answer,
      source: 'Gemini AI (Islamic Assistant)'
    });
  } catch (error) {
    console.error('Error in askQuestion:', error.message);
    res.status(500).json({ error: 'Failed to get response' });
  }
};

module.exports = { askQuestion };
