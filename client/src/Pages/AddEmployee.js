import React, { useState, useContext } from "react";
import api from "../Services/api";
import Swal from "sweetalert2";
import { FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

export default function AddEmployee() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", formData, {
        headers: {
          Authorization: `Bearer ${
            user?.token || localStorage.getItem("token")
          }`,
        },
      });

      Swal.fire("Success", "Employee added successfully!", "success");

      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.msg || "Failed to add employee",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4 ">
      <h3 className="mb-3">
        <FaUserPlus className="me-2" /> Add New Employee
      </h3>

      <form onSubmit={handleSubmit} className="row g-3 ms-5 mt-2 box">
        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
}