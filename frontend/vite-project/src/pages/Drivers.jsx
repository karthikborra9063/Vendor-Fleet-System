import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Drivers = () => {
  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    assignedCar: '',
  });

  const [files, setFiles] = useState({
    licenseImage: null,
    rc: null,
    pollutionCertificate: null,
  });

  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchDrivers();
    fetchCars();
  }, []);

  const fetchDrivers = async () => {
    const res = await api.get('/drivers');
    setDrivers(res.data);
  };

  const fetchCars = async () => {
    const res = await api.get('/cars');
    setCars(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/drivers/${id}/approve`);
      setDrivers((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: 'Approved' } : d))
      );
    } catch (err) {
      alert('Failed to approve driver');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/drivers/${id}/reject`);
      setDrivers((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: 'Rejected' } : d))
      );
    } catch (err) {
      alert('Failed to reject driver');
    }
  };


  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    Object.entries(files).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    try {
      await api.post('/drivers', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset
      setForm({
        name: '',
        licenseNumber: '',
        licenseExpiry: '',
        assignedCar: '',
      });
      setFiles({ licenseImage: null, rc: null, pollutionCertificate: null });
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert('Error adding driver');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Expired':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Driver Onboarding</h3>

      <div className="card p-4 shadow mb-4">
        <div className="row g-3">
          {/* Form Fields */}
          <div className="col-md-4">
            <label className="form-label">Driver Name</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">License Number</label>
            <input className="form-control" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">License Expiry</label>
            <input type="date" className="form-control" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Assigned Car</label>
            <select className="form-select" name="assignedCar" value={form.assignedCar} onChange={handleChange}>
              <option value="">Select a car</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.registrationNumber}
                </option>
              ))}
            </select>
          </div>

          {/* File Inputs */}
          <div className="col-md-4">
            <label className="form-label">License Image</label>
            <input type="file" className="form-control" name="licenseImage" onChange={handleFileChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">RC</label>
            <input type="file" className="form-control" name="rc" onChange={handleFileChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Pollution Certificate</label>
            <input type="file" className="form-control" name="pollutionCertificate" onChange={handleFileChange} />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Driver Table */}
      <div className="card shadow p-3">
        <h5>All Drivers</h5>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Assigned Car</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.licenseNumber}</td>
                <td>{d.licenseExpiry?.slice(0, 10)}</td>
                <td>
                  <td>
                    <span className={`badge bg-${getBadgeClass(d.status)} me-2`}>
                      {d.status}
                    </span>

                    {d.status === 'Pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(d._id)}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(d._id)}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>

                </td>
                <td>{d.assignedCar?.registrationNumber || '—'}</td>
                <td>
                  <a href={`http://localhost:5000/${d.documents.licenseImage}`} target="_blank">License</a>{' | '}
                  <a href={`http://localhost:5000/${d.documents.rc}`} target="_blank">RC</a>{' | '}
                  <a href={`http://localhost:5000/${d.documents.pollutionCertificate}`} target="_blank">Pollution</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
