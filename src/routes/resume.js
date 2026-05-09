const router = require("express").Router();
const { getResume } = require("../controllers/resumeController");

// GET /api/resume
router.get("/", getResume);

module.exports = router;
