


// src/pages/Profile.js
import React, { useEffect, useState, useContext } from "react";
import { fetchUserProfile } from "../Services/userService";
import { AuthContext } from "../Context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext); // { token, username, etc. }
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchUserProfile(user.token);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    loadProfile();
  }, [user]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
}

export default Profile;
