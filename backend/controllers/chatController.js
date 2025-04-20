const { getGeminiResponse } = require('../services/geminiService');

exports.askQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    const answer = await getGeminiResponse(question);
    res.json({ message: answer });
  } catch (err) {
    console.error('Error in controller:', err.message);
    res.status(500).json({ message: 'Error fetching response from Gemini' });
  }
};
