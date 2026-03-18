import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/employees",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted) setEmployees(res.data || []);
      } catch (err) {
        if (isMounted)
          setError(
            err.response?.data?.msg || "Failed to fetch employees."
          );

        console.error("UpdateEmployee fetch error:", err);
      }
    };

    fetchEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = employees.filter((e) =>
    [e.username, e.email, e.phone]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(q.toLowerCase()))
  );

  const goEdit = (id) => navigate(`/update/${id}`);

  return (
      <div className="flex-grow-1 p-4 ms-4 mt-3 ">
    <div className="container  ms-5 mt-5 box">
      <h3 className="mb-3">Update Employee</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="input-group mb-3" style={{ maxWidth: 420 }}>
        <span className="input-group-text">Search</span>
        <input
          className="form-control"
          placeholder="name, email, phone..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card shadow-sm ">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ width: 120 }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    {employees.length === 0
                      ? "No employees loaded."
                      : "No match for your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.username}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => goEdit(emp._id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdateEmployee;