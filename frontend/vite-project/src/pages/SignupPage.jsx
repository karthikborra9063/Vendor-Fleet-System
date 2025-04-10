import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SubVendor',
    vendor: '',
  });

  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        setVendors(res.data);
      } catch (err) {
        console.error('Failed to load vendors', err);
      }
    };

    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      console.log(form);
      await api.post('/auth/register', form);
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Signup failed. Make sure all fields are valid.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Sign Up</h3>

        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="SubVendor">SubVendor</option>
            <option value="Super">Super</option>
          </select>
        </div>

        <div className="mb-4">
          <label>Assign Vendor</label>
          <select
            name="vendor"
            className="form-select"
            value={form.vendor}
            onChange={handleChange}
            disabled={form.role === 'Super'}
          >
            <option value="">Select Vendor</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} ({v.role})
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary w-100" onClick={handleSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
