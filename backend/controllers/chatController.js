const { getResponse } = require('../services/geminiService');

exports.askQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    // Get the response from all APIs (Quran, Hadith, Gemini)
    const { text, source, reference } = await getResponse(question);

    // Sending the final response with text, source, and reference
    res.json({
      message: text,
      source: source,
      reference: reference || 'No reference available'
    });
  } catch (err) {
    console.error('Error in controller:', err.message);
    res.status(500).json({ message: 'Error fetching response' });
  }
};

