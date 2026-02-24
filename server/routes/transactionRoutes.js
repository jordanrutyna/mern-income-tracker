const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.delete("/:id", authMiddleware, deleteTransaction);
router.get("/summary", authMiddleware, getSummary);

module.exports = router;
