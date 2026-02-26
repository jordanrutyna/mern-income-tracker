const Budget = require("../models/Budget");

// Create or update budget
exports.setBudget = async (req, res) => {
  try {
    const { category, monthlyLimit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user, category },
      { monthlyLimit },
      { new: true, upsert: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all user budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};