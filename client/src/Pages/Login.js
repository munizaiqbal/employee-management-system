// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { AuthContext } from "../Context/AuthContext";
import logo from "../Assets/employeelogo.png";
import bgImage from "../Assets/ems.jpg";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://employee-management-system-1-gjsk.onrender.com/api/auth/login",
        form,
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login({ token, user });

      Swal.fire({
        title: `Welcome, ${user.username}! 👋`,
        text: "Login successful",
        icon: "success",
        confirmButtonColor: "#4A90E2",
      });

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Blurred background */}
      <div
        className="background-blur"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm justify-content-center position-relative z-3">
        <a
          className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2"
          href="/"
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "35px", height: "35px", objectFit: "contain" }}
          />
          <span
            style={{ fontSize: "2rem", color: "#404969", fontWeight: "bold" }}
          >
            Employee Management System
          </span>
        </a>
      </nav>

      {/* Login Form */}
      <div className="login-content">
        <div className="login-card card shadow-lg p-4">
          <h2 className="mb-4 text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} autocomplete="off">
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                autocomplete="off"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                autocomplete="off"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              autocomplete="off"
              className="btn btn-primary w-100"
              disabled={!form.email || !form.password}
            >
              Login
            </button>

            <div className="text-center mt-3">
              <small>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
