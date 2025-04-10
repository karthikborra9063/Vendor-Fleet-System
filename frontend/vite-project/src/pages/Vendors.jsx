import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    role: 'City',
    parentVendor: '',
    permissions: [],
  });

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, permissions: [...form.permissions, value] });
    } else {
      setForm({
        ...form,
        permissions: form.permissions.filter((perm) => perm !== value),
      });
    }
  };

  const handleAddVendor = async () => {
    try {
      await api.post('/vendors', form);
      setForm({ name: '', role: 'City', parentVendor: '', permissions: [] });
      fetchVendors();
    } catch (err) {
      alert('Error creating vendor');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Vendor Management</h3>

      <div className="card mb-4 p-3 shadow">
        <h5>Add Vendor</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Vendor Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="City">City</option>
              <option value="Regional">Regional</option>
              <option value="Super">Super</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="parentVendor"
              value={form.parentVendor}
              onChange={handleChange}
              disabled={form.role === 'Super'}
            >
              <option value="">Select Parent Vendor</option>
              {vendors
                .filter((v) => v.role !== 'City')
                .map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} ({v.role})
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleAddVendor}>
              Add
            </button>
          </div>
        </div>

        <div className="mt-3">
          <strong>Permissions:</strong>
          <div className="form-check form-check-inline ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="canAddDrivers"
              checked={form.permissions.includes('canAddDrivers')}
              onChange={handleCheckbox}
            />
            <label className="form-check-label">Add Drivers</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              value="canAddCars"
              checked={form.permissions.includes('canAddCars')}
              onChange={handleCheckbox}
            />
            <label className="form-check-label">Add Cars</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              value="canViewStats"
              checked={form.permissions.includes('canViewStats')}
              onChange={handleCheckbox}
            />
            <label className="form-check-label">View Stats</label>
          </div>
        </div>
      </div>

      <div className="card shadow p-3">
        <h5>All Vendors</h5>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Parent</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.role}</td>
                <td>{v.parentVendor ? v.parentVendor.name : '—'}</td>
                <td>{v.permissions.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;
