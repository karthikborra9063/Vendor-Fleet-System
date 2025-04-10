import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow text-white bg-primary">
            <div className="card-body">
              <h5>Total Vendors</h5>
              <h3>{stats.totalVendors}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow text-white bg-success">
            <div className="card-body">
              <h5>Total Drivers</h5>
              <h3>{stats.totalDrivers}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow text-white bg-warning">
            <div className="card-body">
              <h5>Expired Drivers</h5>
              <h3>{stats.expiredDrivers}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow text-white bg-dark">
            <div className="card-body">
              <h5>Total Cars</h5>
              <h3>{stats.totalCars || 'N/A'}</h3> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
