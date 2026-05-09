const UAParser = require("ua-parser-js");
const Visitor = require("../models/Visitor");

/**
 * Records or updates a visitor session.
 * Called on page load from the frontend (POST /api/analytics/visit).
 */
async function recordVisit({ sessionId, ip, userAgent, referrer, page }) {
  const ua = UAParser(userAgent || "");

  const existing = await Visitor.findOne({ sessionId });
  if (existing) return existing; // session already recorded

  const visitor = new Visitor({
    sessionId,
    ip,
    userAgent,
    browser: `${ua.browser.name || "Unknown"} ${ua.browser.version || ""}`.trim(),
    os: `${ua.os.name || "Unknown"} ${ua.os.version || ""}`.trim(),
    device: ua.device.type || "desktop",
    referrer: referrer || "direct",
    page: page || "/",
    sessionStart: new Date(),
  });

  return visitor.save();
}

/**
 * Appends a section-view event to the session.
 * Called when the user scrolls to / leaves a section (POST /api/analytics/section).
 */
async function recordSectionView({ sessionId, section, timeSpentMs }) {
  return Visitor.findOneAndUpdate(
    { sessionId },
    {
      $push: { sectionsViewed: { section, enteredAt: new Date(), timeSpentMs } },
      $inc: { totalTimeMs: timeSpentMs || 0 },
    },
    { new: true }
  );
}

/**
 * Marks the session end time.
 * Called on beforeunload (POST /api/analytics/end).
 */
async function endSession({ sessionId, totalTimeMs }) {
  return Visitor.findOneAndUpdate(
    { sessionId },
    { sessionEnd: new Date(), totalTimeMs },
    { new: true }
  );
}

/**
 * Returns aggregated analytics summary.
 * Protected by admin secret header.
 */
async function getSummary({ days = 30 } = {}) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    totalVisitors,
    uniqueIPs,
    sectionStats,
    deviceStats,
    browserStats,
    referrerStats,
    dailyVisits,
  ] = await Promise.all([
    Visitor.countDocuments({ createdAt: { $gte: since } }),

    Visitor.distinct("ip", { createdAt: { $gte: since } }),

    Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: "$sectionsViewed" },
      {
        $group: {
          _id: "$sectionsViewed.section",
          views: { $sum: 1 },
          avgTimeMs: { $avg: "$sectionsViewed.timeSpentMs" },
        },
      },
      { $sort: { views: -1 } },
    ]),

    Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Visitor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const avgSessionMs =
    (
      await Visitor.aggregate([
        { $match: { createdAt: { $gte: since }, totalTimeMs: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: "$totalTimeMs" } } },
      ])
    )[0]?.avg || 0;

  return {
    period: `last_${days}_days`,
    totalVisitors,
    uniqueVisitors: uniqueIPs.length,
    avgSessionSeconds: Math.round(avgSessionMs / 1000),
    sections: sectionStats,
    devices: deviceStats,
    browsers: browserStats,
    referrers: referrerStats,
    dailyVisits,
  };
}

module.exports = { recordVisit, recordSectionView, endSession, getSummary };
