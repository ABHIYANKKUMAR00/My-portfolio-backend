require("dotenv").config();
require("express-async-errors");

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio API running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`   Base URL : http://localhost:${PORT}/api`);
  });
})().catch((err) => {
  console.error("\n❌ Server failed to start:", err.message);
  console.error("   Check your .env file and make sure MongoDB is reachable.\n");
  process.exit(1);
});
