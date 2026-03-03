import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;


// import { useEffect } from "react";
// import axios from "axios";
// function App() {
//   useEffect(() => {
//     axios
//       .get("http://localhost:5050/")
//       .then((res) => {
//         console.log("Backend response:", res.data);
//       })
//       .catch((err) => {
//         console.error("Error connecting to backend:", err);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>MERN Income Tracker</h1>
//       <p>Check console for backend connection</p>
//     </div>
//   );
// }

// export default App;