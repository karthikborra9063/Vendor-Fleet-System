import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    registrationNumber: '',
    model: '',
    seatingCapacity: '',
    fuelType: '',
  });

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCar = async () => {
    try {
      await api.post('/cars', form);
      setForm({ registrationNumber: '', model: '', seatingCapacity: '', fuelType: '' });
      fetchCars();
    } catch (err) {
      alert('Error creating car');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Car Management</h3>

      <div className="card mb-4 p-3 shadow">
        <h5>Add Car</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Registration Number"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Seating Capacity"
              name="seatingCapacity"
              value={form.seatingCapacity}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
            >
              <option value="">Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" onClick={handleAddCar}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow p-3">
        <h5>All Cars</h5>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Model</th>
              <th>Seats</th>
              <th>Fuel</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>{car.registrationNumber}</td>
                <td>{car.model}</td>
                <td>{car.seatingCapacity}</td>
                <td>{car.fuelType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
