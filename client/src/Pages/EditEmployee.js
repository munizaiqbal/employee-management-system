import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://employee-management-system-1-gjsk.onrender.com/api/employees/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setEmployee(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://employee-management-system-1-gjsk.onrender.com/api/user/${id}/update`,
        employee,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Swal.fire("Success", "Employee updated successfully", "success");

      navigate("/employees");
    } catch (error) {
      Swal.fire("Error", "Failed to update employee", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Employee</h3>

      <form onSubmit={handleUpdate} className="ms-5 ps-3">
        <div className="mb-3 ">
          <label>Name</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={employee.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={employee.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={employee.phone}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
