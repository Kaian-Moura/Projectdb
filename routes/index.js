// routes/index.js
const express = require("express");
const router = express.Router();

// Import routes
try {
  const reservasRoutes = require("./reservas");

  // Register routes
  router.use("/reservas", reservasRoutes);
  console.log("Reservas routes registered successfully");
} catch (error) {
  console.error("Error loading reservas routes:", error.message);
}

module.exports = router;
