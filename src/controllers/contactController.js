const Contact = require("../models/Contact");
const { sendContactNotification, sendAutoReply } = require("../services/emailService");

async function submitContact(req, res) {
  const { name, email, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    message,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Fire emails in parallel; don't fail the response if email breaks
  try {
    await Promise.all([
      sendContactNotification({ name, email, message }),
      sendAutoReply({ name, email }),
    ]);
  } catch (emailErr) {
    console.error("⚠️  Email send failed (contact saved):", emailErr.message);
  }

  res.status(201).json({
    success: true,
    message: "Your message has been received! I'll get back to you shortly.",
    id: contact._id,
  });
}

async function listContacts(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(),
  ]);

  res.json({ total, page, limit, contacts });
}

module.exports = { submitContact, listContacts };
