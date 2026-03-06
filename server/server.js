require("dotenv").config();

const PORT = process.env.PORT || 5050;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Income Tracker API is running 🚀");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

