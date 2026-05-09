const { getGroqClient } = require("../config/groq");
const { buildAIContext } = require("../data/portfolioData");
const ChatHistory = require("../models/ChatHistory");

const SYSTEM_PROMPT = buildAIContext();
const MAX_HISTORY_MESSAGES = 10;
const MAX_USER_MESSAGE_LENGTH = 500;

async function chat({ sessionId, userMessage, ip }) {
  if (userMessage.length > MAX_USER_MESSAGE_LENGTH) {
    throw Object.assign(new Error("Message too long (max 500 characters)"), { status: 400 });
  }

  const groq = getGroqClient();

  let session = await ChatHistory.findOne({ sessionId });
  if (!session) {
    session = new ChatHistory({ sessionId, ip, messages: [] });
  }

  const recentMessages = session.messages.slice(-MAX_HISTORY_MESSAGES);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentMessages,
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 600,
    temperature: 0.7,
  });

  const assistantReply = response.choices[0].message.content.trim();
  const tokensUsed = response.usage?.total_tokens || 0;

  // Persist both turns
  session.messages.push(
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantReply }
  );
  session.totalTokensUsed += tokensUsed;
  await session.save();

  return { reply: assistantReply, sessionId };
}

/**
 * Returns the full chat history for a session (admin use).
 */
async function getHistory(sessionId) {
  return ChatHistory.findOne({ sessionId }).lean();
}

module.exports = { chat, getHistory };
