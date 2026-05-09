module.exports = function errorHandler(err, req, res, _next) {
  // CORS error
  if (err.message && err.message.startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "An unexpected error occurred."
      : err.message || "Internal server error";

  if (status === 500) {
    console.error("💥 Unhandled error:", err);
  }

  res.status(status).json({ error: message });
};
