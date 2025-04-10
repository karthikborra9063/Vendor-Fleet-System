import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/dashboard.jsx';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage.jsx';
import Vendors from './pages/Vendors.jsx';
import Drivers from './pages/Drivers.jsx';
import Cars from './pages/Cars.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/cars" element={<Cars />} />
      </Routes>
    </Router>
  );
}

export default App;
