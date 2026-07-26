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
import "./Sidebar.css";

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
    <aside className="bg-light border-end shadow-sm d-flex flex-column sidebar py-3 py-md-5">
      {/* Navigation links */}
      <nav className="px-3 d-flex mx-auto mx-sm-0 justify-content-center flex-md-column gap-1 overflow-auto">
        {role === "admin" && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `d-flex align-items-center  gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Dashboard"
            >
              <FaTachometerAlt />
              <span className="d-none d-sm-inline">Dashboard</span>
            </NavLink>

            <NavLink
              to="/add-employee"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Add Employee"
            >
              <FaUserPlus />
              <span className="d-none d-sm-inline">Add Employee</span>
            </NavLink>

            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Employee List"
            >
              <FaListUl />
              <span className="d-none d-sm-inline">Employee List</span>
            </NavLink>

            <NavLink
              to="/update-employee"
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              title="Update Employee"
            >
              <FaUserEdit />
              <span className="d-none d-sm-inline">Update Employee</span>
            </NavLink>
          </>
        )}

        {/* Employee-only dashboard link */}
        {role === "employee" && (
          <NavLink
            to="/employee-dashboard"
            className={({ isActive }) =>
              `d-flex align-items-center justify-content-center  gap-2  px-3 py-2 rounded text-decoration-none w-100  w-md-auto ${
            isActive ? "bg-primary text-white" : "text-dark"
          }`
            }
            title="Dashboard"
          >
            <FaTachometerAlt />
            <span className="d-none d-sm-inline">Dashboard</span>
          </NavLink>
        )}
      </nav>

      {/* 🚪 Logout Button — Only visible when logged in */}
      {(role === "admin" || role === "employee") && (
        <div className="px-3 pt-2 border-top mt-2">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            title="Logout"
          >
            <FaSignOutAlt />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;