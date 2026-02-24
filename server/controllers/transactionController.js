const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// Create transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all user transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get financial summary
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user;
    const { month, year } = req.query;

    let matchStage = {
      user: new mongoose.Types.ObjectId(userId),
    };

    // If month and year provided, filter by date range
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      matchStage.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const summary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],
          categories: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);

    const totals = summary[0].totals;
    const categories = summary[0].categories;

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpenses = item.total;
    });

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryBreakdown: categories.map((cat) => ({
        category: cat._id,
        total: cat.total,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

