const aiService = require("../services/aiService");

async function sendMessage(req, res) {
  const { sessionId, message } = req.body;
  const ip = req.ip;

  const result = await aiService.chat({ sessionId, userMessage: message, ip });

  res.json({
    success: true,
    sessionId: result.sessionId,
    reply: result.reply,
  });
}

async function getChatHistory(req, res) {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  const history = await aiService.getHistory(sessionId);
  if (!history) return res.status(404).json({ error: "Session not found" });

  res.json(history);
}

module.exports = { sendMessage, getChatHistory };
