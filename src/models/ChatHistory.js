const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    ip: { type: String },
    messages: [messageSchema],
    totalTokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

chatHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
