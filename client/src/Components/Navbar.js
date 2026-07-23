import React, { useContext, useEffect, useState } from "react";
import { FaBell, FaUser, FaSearch } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import logo from "../Assets/employeelogo.png";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const userData = user || JSON.parse(localStorage.getItem("user")) || {};

  // count only unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 🔔 Fetch Notifications with polling
  useEffect(() => {
    if (!isLoggedIn || userData.role !== "admin") return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "https://employee-management-system-1-gjsk.onrender.com/api/notification",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn, userData.role]);

  // 🔔 Mark notification as read
  const markNotificationRead = async (id) => {
    try {
      await axios.put(
        `https://employee-management-system-1-gjsk.onrender.com/api/notification/mark-read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  // 🔍 Live search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://employee-management-system-1-gjsk.onrender.com/api/employees/search/${encodeURIComponent(
            searchQuery,
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setSearchResults(res.data);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Hide everything except logo when not logged in
  if (!isLoggedIn) {
    return (
      <nav className="navbar navbar-light bg-light shadow-sm fixed-top border-bottom px-4">
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
    );
  }

  return (
    <nav className="navbar navbar-expand-md p-1 p-sm-3 navbar-light bg-light shadow-sm fixed-top border-bottom px-3 px-lg-4">
      <div className="container-fluid">
        {/* Logo */}
        <a
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          href={userData.role === "admin" ? "/admin" : "/employee-dashboard"}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "35px", height: "35px", objectFit: "contain" }}
          />
          <span
            className="d-none d-sm-inline me-0 me-md-4"
            style={{
              fontSize: "1.35rem",
              color: "#404969",
              fontWeight: "bold",
            }}
          >
            Employee Management System
          </span>
        </a>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto d-flex flex-row flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 w-100">
            {/* Admin features (Search + Notifications) */}
            {userData.role === "admin" && (
              <div className="d-flex flex-row  flex-sm-row w-100 w-sm-auto gap-2 gap-sm-3">
                {/* Search box */}
                <div
                  className="position-relative  mt-2 m-sm-0 flex-grow-1 flex-sm-grow-0"
                  style={{ minWidth: "200px" }}
                >
                  <input
                    className="form-control ps-5"
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      searchResults.length > 0 && setShowSearchDropdown(true)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowSearchDropdown(false), 150)
                    }
                  />
                  <FaSearch
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                  />
                  {showSearchDropdown && searchResults.length > 0 && (
                    <ul
                      className="dropdown-menu show shadow-sm w-100"
                      style={{
                        position: "absolute",
                        top: "100%",
                        maxHeight: "250px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {searchResults.map((emp) => (
                        <li key={emp._id} className="dropdown-item small">
                          {emp.username} - {emp.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Notifications */}
                <div className="nav-item dropdown position-relative d-flex align-items-center">
                  <button
                    className="btn btn-link nav-link position-relative"
                    id="notificationDropdown"
                    data-bs-toggle="dropdown"
                  >
                    <FaBell size={20} />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-sm"
                    style={{
                      minWidth: "250px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <li
                          key={note._id}
                          className={`dropdown-item small ${note.isRead ? "text-muted" : "fw-bold"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => markNotificationRead(note._id)}
                        >
                          {note.message || "New notification"}
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-item text-muted small">
                        No notifications
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Profile */}
            <div className="mt-2 d-none d-sm-flex ms-auto ">
              <button className="btn p-1 btn-outline-secondary d-flex align-items-center">
                <FaUser className="me-1" />
                <span className="ms-1">{userData.username || "User"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
