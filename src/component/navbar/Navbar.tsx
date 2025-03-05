import React, { useState } from "react";
import "./Navbar.css";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [mobileMenu, setMobileMenu] = useState(false); // Mobile menu toggle state

  // Handle login functionality
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout functionality
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">LezDo TechMed</div>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileMenu ? "active" : ""}`}>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/news">Market News</a>
            </li>
            <li>
              <a href="/portfolio">My Portfolio</a>
            </li>
            <li>
              <a href="/stocks">Stocks</a>
            </li>
          </ul>
        </div>

        {/* User or Login Button */}
        <div className="navbar-user">
          {!isLoggedIn ? (
            <button onClick={handleLogin} className="login-btn">
              Login
            </button>
          ) : (
            <div className="user-info">
              <div className="user-avatar" onClick={handleLogout}>
                <img src="/path/to/avatar.png" alt="Avatar" />
              </div>
            </div>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="navbar-toggle" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
