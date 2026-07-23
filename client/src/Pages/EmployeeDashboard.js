import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  //  Fetch employee attendance
  const fetchAttendance =useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://employee-management-system-1-gjsk.onrender.com/api/attendance/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAttendance(res.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      Swal.fire("Error", "Unable to load attendance records", "error");
    } finally {
      setLoading(false);
    }
  },[token]);

  useEffect(() => {
    if (token && user) {
      fetchAttendance();
    }
  }, [token, user,fetchAttendance]);

  // Mark attendance
  const markAttendance = async (type) => {
    try {
      const res = await axios.post(
        "https://employee-management-system-1-gjsk.onrender.com/api/attendance/mark",
        { type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", res.data.message, "success");

      // refresh attendance
      fetchAttendance();
    } catch (error) {
      console.error("Attendance marking failed:", error);

      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to mark attendance",
        "error"
      );
    }
  };

  return (
    <div className="main-content">
      <div className="container-fluid px-2 px-sm-3 px-md-4 py-4 py-sm-5">
        {/* Welcome Section */}
        <div className="text-center text-sm-start mb-4">
          <h2 className="fw-bold text-primary fs-2 fs-sm-1">
            Welcome, {user?.username || "Employee"}
          </h2>
          <p className="text-muted small">Your daily attendance record</p>
        </div>

        {/* Check In / Check Out Buttons - Responsive */}
        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-start gap-2 gap-sm-3 mb-4">
          <button
            className="btn btn-success px-4 py-2 w-100 w-sm-auto"
            onClick={() => markAttendance("checkin")}
          >
            <span className="me-2">✅</span> Check In
          </button>

          <button
            className="btn btn-danger px-4 py-2 w-100 w-sm-auto"
            onClick={() => markAttendance("checkout")}
          >
            <span className="me-2">🚪</span> Check Out
          </button>
        </div>

        {/* Attendance Table Card */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3">
              <h5 className="text-secondary fw-bold mb-2 mb-sm-0">
                Attendance History
              </h5>
              {!loading && attendance.length > 0 && (
                <span className="badge bg-primary">
                  Total Records: {attendance.length}
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading attendance...</p>
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0">No attendance records found.</p>
                <p className="text-muted small">Use the buttons above to check in/out.</p>
              </div>
            ) : (
              <>
                {/* Responsive table - scroll on mobile, full width on desktop */}
                <div className="d-block d-md-none table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" style={{ width: '50px' }}>#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Check In</th>
                        <th scope="col">Check Out</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record, index) => (
                        <tr key={record._id}>
                          <td className="fw-medium">{index + 1}</td>
                          <td>
                            {record.date ? (
                              <span className="text-nowrap">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            ) : "-"}
                          </td>
                          <td>
                            {record.checkIn ? (
                              <span className="text-nowrap">
                                {new Date(record.checkIn).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            ) : "-"}
                          </td>
                          <td>
                            {record.checkOut ? (
                              <span className="text-nowrap">
                                {new Date(record.checkOut).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            ) : "-"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                record.checkOut
                                  ? "bg-success"
                                  : record.checkIn
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {record.checkOut
                                ? "Checked Out"
                                : record.checkIn
                                ? "Checked In"
                                : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Desktop table - no scroll, full width */}
                <div className="d-none d-md-block">
                  <table className="table table-striped table-hover align-middle mb-0 w-100">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" style={{ width: '50px' }}>#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Check In</th>
                        <th scope="col">Check Out</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record, index) => (
                        <tr key={record._id}>
                          <td className="fw-medium">{index + 1}</td>
                          <td>
                            {record.date ? (
                              new Date(record.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            ) : "-"}
                          </td>
                          <td>
                            {record.checkIn ? (
                              new Date(record.checkIn).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            ) : "-"}
                          </td>
                          <td>
                            {record.checkOut ? (
                              new Date(record.checkOut).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            ) : "-"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                record.checkOut
                                  ? "bg-success"
                                  : record.checkIn
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {record.checkOut
                                ? "Checked Out"
                                : record.checkIn
                                ? "Checked In"
                                : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

      
      </div>
    </div>
  );
}