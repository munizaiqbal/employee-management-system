import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [viewTitle, setViewTitle] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard stats.");
      }
    };

    fetchStats();
  }, [user]);

  const loadEmployees = async (type) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard/${type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setEmployees(res.data);

      if (type === "employees") setViewTitle("All Employees");
      if (type === "present") setViewTitle("Present Employees");
      if (type === "absent") setViewTitle("Absent Employees");
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  if (error) {
    return <div className="text-danger p-3">{error}</div>;
  }

  if (!stats) return null;

  return (
    <div className="main-content">
      <div className="container-fluid px-2 px-sm-3 px-md-4">
        <div className="d-flex flex-column mt-4 mt-sm-5 pt-3 pt-sm-4 gap-3">
          {/* Header */}
          <h2 className="text-center text-sm-start mb-2 mb-sm-3">
            Admin Dashboard
          </h2>

          {/* Stats Cards Row */}
          <div className="row g-3">
            {/* Total Employees */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className="card text-white bg-primary  shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => loadEmployees("employees")}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-3">
                  <h6 className="card-title fs-6 fs-md-5 mb-2">Total Employees</h6>
                  <p className="card-text fs-2 fw-bold mb-0">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>

            {/* Present Today */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className="card text-white bg-success  shadow-sm"
                style={{ cursor: "pointer"}}
                onClick={() => loadEmployees("present")}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-3">
                  <h6 className="card-title fs-6 fs-md-5 mb-2">Present Today</h6>
                  <p className="card-text fs-2 fw-bold mb-0">{stats.presentToday}</p>
                </div>
              </div>
            </div>

            {/* Absent Today */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className="card text-white bg-danger  shadow-sm"
                style={{ cursor: "pointer"}}
                onClick={() => loadEmployees("absent")}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-3">
                  <h6 className="card-title fs-6 fs-md-5 mb-2">Absent Today</h6>
                  <p className="card-text fs-2 fw-bold mb-0">{stats.absentToday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          {employees.length > 0 && (
            <div className="card mt-4 shadow-sm">
              <div className="card-body p-3 p-md-4">
                <h4 className="mb-3 mb-md-4">{viewTitle}</h4>
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" style={{ width: '60px' }}>#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees
                        .filter((emp) => emp !== null)
                        .map((emp, index) => (
                          <tr key={emp._id}>
                            <td>{index + 1}</td>
                            <td className="fw-medium">{emp.username}</td>
                            <td className="text-break">{emp.email}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile-friendly row count */}
                <div className="text-muted mt-3 small d-block d-sm-none">
                  Showing {employees.length} employee(s)
                </div>
              </div>
            </div>
          )}
          
          {/* Empty state when no employees */}
          {employees.length === 0 && viewTitle && (
            <div className="alert alert-info mt-4 text-center">
              No {viewTitle.toLowerCase()} to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;