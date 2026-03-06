import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Account created! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h2>Create Account</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p style={{ marginTop: "20px" }}>
        Already have an account?
        <a href="/"> Login</a>
      </p>
    </div>
  );
}

export default Register;