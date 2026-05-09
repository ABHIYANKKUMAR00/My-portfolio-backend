const router = require("express").Router();
const {
  trackVisit,
  trackSection,
  endSession,
  getAnalytics,
} = require("../controllers/analyticsController");
const { validate, visitSchema, sectionSchema, sessionEndSchema } = require("../middleware/validate");
const adminAuth = require("../middleware/adminAuth");

// Public — called by the frontend JS snippet
router.post("/visit", validate(visitSchema), trackVisit);
router.post("/section", validate(sectionSchema), trackSection);
router.post("/end", validate(sessionEndSchema), endSession);

// Admin only
router.get("/", adminAuth, getAnalytics);

module.exports = router;
