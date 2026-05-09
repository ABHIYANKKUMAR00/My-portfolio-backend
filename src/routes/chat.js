const router = require("express").Router();
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const { validate, chatSchema } = require("../middleware/validate");
const { chatRateLimiter } = require("../middleware/rateLimiter");
const adminAuth = require("../middleware/adminAuth");

// POST /api/chat — public
router.post("/", chatRateLimiter, validate(chatSchema), sendMessage);

// GET /api/chat/history/:sessionId — admin only
router.get("/history/:sessionId", adminAuth, getChatHistory);

module.exports = router;
