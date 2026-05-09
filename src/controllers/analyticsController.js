const analyticsService = require("../services/analyticsService");

async function trackVisit(req, res) {
  const { sessionId, referrer, page } = req.body;
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];

  await analyticsService.recordVisit({ sessionId, ip, userAgent, referrer, page });
  res.status(200).json({ success: true });
}

async function trackSection(req, res) {
  const { sessionId, section, timeSpentMs } = req.body;
  await analyticsService.recordSectionView({ sessionId, section, timeSpentMs });
  res.status(200).json({ success: true });
}

async function endSession(req, res) {
  const { sessionId, totalTimeMs } = req.body;
  await analyticsService.endSession({ sessionId, totalTimeMs });
  res.status(200).json({ success: true });
}

async function getAnalytics(req, res) {
  const days = parseInt(req.query.days) || 30;
  const summary = await analyticsService.getSummary({ days });
  res.json(summary);
}

module.exports = { trackVisit, trackSection, endSession, getAnalytics };
