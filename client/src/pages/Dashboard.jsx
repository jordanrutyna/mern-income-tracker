import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5050/api/transactions/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSummary(res.data);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Total Income: {summary.totalIncome}</p>
      <p>Total Expenses: {summary.totalExpenses}</p>
      <p>Net Balance: {summary.netBalance}</p>

      <h3>Category Breakdown</h3>

      {summary.categoryBreakdown.map((cat) => (
        <div
          key={cat.category}
          style={{
            padding: "8px",
            margin: "5px 0",
            color: "black",
            backgroundColor: cat.overBudget ? "#ffcccc" : "#f0f0f0",
          }}
        >
          <strong>{cat.category}</strong> — ${cat.total}
          {cat.limit && (
            <span> / Limit: ${cat.limit}</span>
          )}
          {cat.overBudget && (
            <span style={{ color: "red", marginLeft: "10px" }}>
              Over Budget
            </span>
          )}
        </div>
      ))}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;