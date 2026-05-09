/**
 * Lightweight admin auth — checks the x-admin-secret header.
 * For production consider JWT or an OAuth solution instead.
 */
function adminAuth(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "ADMIN_SECRET is not configured on the server." });
  }
  const provided = req.headers["x-admin-secret"];
  if (!provided || provided !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = adminAuth;
