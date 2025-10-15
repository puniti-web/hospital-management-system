// import React, { useState } from "react";
// import api from "../api";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [role, setRole] = useState("patient");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/login", { emailOrContact: email, password, role });
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", role);
//       if (role === "doctor") navigate("/doctor");
//       else if (role === "admin") navigate("/admin");
//       else navigate("/patient");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 50 }}>
//       <h2>Hospital Management System</h2>
//       <form onSubmit={handleLogin}>
//         <label>Role:</label><br/>
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="patient">Patient</option>
//           <option value="doctor">Doctor</option>
//           <option value="admin">Admin</option>
//         </select><br/><br/>
//         <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br/><br/>
//         <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} /><br/><br/>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import api from "../api"; // Axios instance
import { useNavigate } from "react-router-dom";
import "./Login.css"; // We'll create this CSS based on your HTML styling

export default function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        emailOrContact: email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      // Navigate based on role
      if (role === "doctor") navigate("/doctor");
      else if (role === "admin") navigate("/admin");
      else navigate("/patient");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        <div className="header">
          <div className="logo">
            <svg
              className="logo-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>TEAM UTPA</span>
          </div>
          <h1>Hospital Management System</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* Role Selection */}
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email or Contact</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or contact number"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Error */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                Logging in...
                <span className="loading-spinner"></span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="signup-text">
          Need an account?{" "}
          <a href="#" className="signup-link">
            Contact Administrator
          </a>
        </p>
      </div>
    </div>
  );
}
