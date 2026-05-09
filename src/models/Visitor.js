const mongoose = require("mongoose");

const sectionViewSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    enteredAt: { type: Date },
    timeSpentMs: { type: Number, default: 0 },
  },
  { _id: false }
);

const visitorSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    ip: { type: String },
    userAgent: { type: String },
    browser: { type: String },
    os: { type: String },
    device: { type: String },
    referrer: { type: String },
    country: { type: String },
    page: { type: String, default: "/" },
    sectionsViewed: [sectionViewSchema],
    totalTimeMs: { type: Number, default: 0 },
    sessionStart: { type: Date, default: Date.now },
    sessionEnd: { type: Date },
  },
  { timestamps: true }
);

visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model("Visitor", visitorSchema);
