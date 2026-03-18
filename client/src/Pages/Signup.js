import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../Services/api"; // adjust path if needed
import Logo from "../Assets/employeelogo.png";
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');
let isAdmin = false;

if (token) {
  const decoded = jwtDecode(token);
  isAdmin = decoded.role === 'admin';
}
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      Swal.fire({
        icon: "success",
        title: "Account created successfully!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto p-4 shadow" style={{ maxWidth: "450px" }}>
        <div className="text-center mb-3">
          <img src={Logo} alt="Logo" width="50" />
          <h3>Signup</h3>
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-control"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          {isAdmin && (
          <div className="mb-3">
            <label>Role</label>
            <select name="role" className="form-select" onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          )}
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-2">
          <small>
            Already have an account? <Link to="/Login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;
