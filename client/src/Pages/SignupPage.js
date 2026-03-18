import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import Swal from 'sweetalert2';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    dob: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      Swal.fire('Success!', 'Account created. Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.msg || 'Signup failed', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" className="form-control mb-3" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="phone" className="form-control mb-3" placeholder="Phone" onChange={handleChange} />
        <input type="date" name="dob" className="form-control mb-3" onChange={handleChange} />
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

