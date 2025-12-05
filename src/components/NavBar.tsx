// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Using NavLink for active states
import './NavBar.css'; // Assuming you have a CSS file for styling
const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Navigation Links */}
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/fixtures"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Fixtures
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/teams"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Teams
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
