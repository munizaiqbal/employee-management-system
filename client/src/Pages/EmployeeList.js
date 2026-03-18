// src/pages/EmployeeList.js
import React, { useEffect, useState, useContext } from "react";
import { fetchAllEmployees } from "../Services/userService";
import { AuthContext } from "../Context/AuthContext";

function EmployeeList() {
  const { user,loading } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
   const [error, setError] = useState("");

useEffect(() => {
    if (loading) return;

    const loadEmployees = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          return;
        }

        const res = await fetchAllEmployees(token);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err.response?.data || err.message);
        setError("Failed to load employees.");
      }
    };

    loadEmployees();
  }, [loading, user]);

  return (
    
      <div className="flex-grow-1 p-4 ms-4 mt-3">
        <div className="container ms-5 mt-5 box ">
          <h2>All Employees</h2>
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <ul className="list-group">
              {employees.map((emp) => (
                <li key={emp._id} className="list-group-item ">
                  <strong>{emp.username}</strong> - {emp.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
   
  );
}

export default EmployeeList;
