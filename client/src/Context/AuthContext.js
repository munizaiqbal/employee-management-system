// src/Context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const login = ({ token, user }) => {
  user.token = token; // attach token to user object
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
};

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token"); // ✅ get token

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  if (!token) {
    setLoading(false);
    return;
  }

  // 🔁 Verify token and get latest user data
axios
  .get("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
    const verifiedUser = { ...res.data.user, token }; // ✅ keep token
    setUser(verifiedUser);
    localStorage.setItem("user", JSON.stringify(verifiedUser));
  })
  .catch((err) => {
    console.log("AUTH ERROR:", err.response?.data || err.message);
    // ❌ don’t clear localStorage immediately
    setUser(null);
  })
    .finally(() => setLoading(false));
}, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
