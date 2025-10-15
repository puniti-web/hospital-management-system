import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { emailOrContact: email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      if (role === "doctor") navigate("/doctor");
      else if (role === "admin") navigate("/admin");
      else navigate("/patient");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Hospital Management System</h2>
      <form onSubmit={handleLogin}>
        <label>Role:</label><br/>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select><br/><br/>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} /><br/><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
