import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const fetchSummary = () => {
    api.get("/transactions/summary").then((res) => {
      setSummary(res.data);
    });
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleAddTransaction = async () => {
    if (!amount || !category) {
      alert("Amount and category are required");
      return;
    }

    await api.post("/transactions", {
      type,
      amount: Number(amount),
      category,
      description,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");

    // Refresh dashboard
    fetchSummary();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!summary) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>💰 Income Tracker</h1>
      <h2 style={{ marginBottom: "10px" }}>Financial Summary</h2>

      <div style={{ marginBottom: "40px" }}>
        <p><strong>Total Income:</strong> ${summary.totalIncome}</p>
        <p><strong>Total Expenses:</strong> ${summary.totalExpenses}</p>
        <p><strong>Net Balance:</strong> ${summary.netBalance}</p>
      </div>

      <h3 style={{ marginBottom: "10px" }}>Add Transaction</h3>
      <div style={{ marginBottom: "40px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          style={{ margin: "5px" }}
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          style={{ margin: "5px" }}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          style={{ margin: "5px" }}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleAddTransaction}>Add</button>
      </div>
      
      <h3 style={{ marginBottom: "10px" }}>Set Budget</h3>
      <div style={{ marginBottom: "40px" }}>

        <input
          style={{ margin: "5px" }}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          style={{ margin: "5px" }}
          type="number"
          placeholder="Monthly Limit"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={async () => {
            if (!category || !amount) {
              alert("Category and limit required");
              return;
            }

            await api.post("/budgets", {
              category,
              monthlyLimit: Number(amount),
            });

            setCategory("");
            setAmount("");
            fetchSummary();
          }}
        >
          Save Budget
        </button>
      </div>

      <h3 style={{ marginBottom: "10px" }}>Category Breakdown</h3>
      <div style={{ marginBottom: "40px" }}>
        {summary.categoryBreakdown.map((cat) => (
          <div
            key={cat.category}
            style={{
              // marginBottom: "20px",
              padding: "8px",
              margin: "5px 0",
              color: "black",
              backgroundColor: cat.overBudget ? "#ffcccc" : "#f0f0f0",
            }}
          >
            <strong>{cat.category}</strong> — ${cat.total}
            {cat.limit && <span> / Limit: ${cat.limit}</span>}
            {cat.overBudget && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                Over Budget
              </span>
            )}
          </div>
        ))}
        <br />
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;