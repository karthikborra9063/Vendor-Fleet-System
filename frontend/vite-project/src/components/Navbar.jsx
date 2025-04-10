import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Vendor Fleet System</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {isLoggedIn && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/vendors">Vendors</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/drivers">Drivers</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cars">Cars</Link></li>
            </>
          )}
        </ul>

        <ul className="navbar-nav">
          {isLoggedIn ? (
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-outline-light" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light" to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
