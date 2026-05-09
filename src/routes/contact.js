const router = require("express").Router();
const { submitContact, listContacts } = require("../controllers/contactController");
const { validate, contactSchema } = require("../middleware/validate");
const { contactRateLimiter } = require("../middleware/rateLimiter");
const adminAuth = require("../middleware/adminAuth");

// POST /api/contact — public
router.post("/", contactRateLimiter, validate(contactSchema), submitContact);

// GET /api/contact — admin only
router.get("/", adminAuth, listContacts);

module.exports = router;
