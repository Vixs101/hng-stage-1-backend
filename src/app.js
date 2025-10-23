const express = require("express");
const stringRoutes = require("./routes/strings");

const app = express();

// middleware to parse json bodies
app.use(express.json());

// middleware to parse url encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// root
app.get("/", (req, res) => {
  res.json({
    message: "String Analyzer API",
    version: "1.0.0",
    endpoints: {
      "POST /strings": "Create and analyze a string",
      "GET /strings/:value": "Get a specific string",
      "GET /strings": "Get all strings with filters",
      "GET /strings/filter-by-natural-language":
        "Filter using natural language",
      "DELETE /strings/:value": "Delete a string",
    },
  });
});

app.use("/strings", stringRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred",
  });
});

module.exports = app;
