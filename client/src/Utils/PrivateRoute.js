// src/Utils/PrivateRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // 🔁 Wait for context to finish loading
  if (loading) {
    return <div>Loading Profile...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ⚠️ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  // ✅ Authorized
  return children;
};

export default PrivateRoute;
