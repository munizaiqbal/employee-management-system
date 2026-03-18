import React, { useContext, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUserEdit,
  FaListUl,
  FaSignOutAlt,
} from "react-icons/fa";
import './Sidebar.css'

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const role = useMemo(() => {
    if (user?.role) return user.role;
    if (user?.user?.role) return user.user.role;
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      return stored?.role;
    } catch {
      return undefined;
    }
  }, [user]);

  // 🚪 Handle Logout
  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Hide sidebar entirely on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <aside
      className="bg-light border-end shadow-sm d-flex flex-md-column justify-content-between sidebar "

    >
      {/* Navigation links */}
     <nav className="px-3 d-flex flex-md-column flex-wrap">
        {role === "admin" && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-2 text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Dashboard"
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/add-employee"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-2 text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Add Employee"
            >
              <FaUserPlus />
              <span>Add Employee</span>
            </NavLink>

            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-2 text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Employee List"
            >
              <FaListUl />
              <span>Employee List</span>
            </NavLink>

            <NavLink
              to="/update-employee"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded mb-2 text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Update Employee"
            >
              <FaUserEdit />
              <span>Update Employee</span>
            </NavLink>
          </>
        )}

        {/* Employee-only dashboard link */}
        {role === "employee" && (
          <NavLink
            to="/employee-dashboard"
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 px-3 py-2 rounded mb-2 text-decoration-none ${
                isActive ? "bg-primary text-white" : "text-dark"
              }`
            }
            title="Dashboard"
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        )}
       </nav>

      {/* 🚪 Logout Button — Only visible when logged in */}
      {(role === "admin" || role === "employee") && (
        <div className="p-3 border-top">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
     
    </aside>
  );
};

export default Sidebar;