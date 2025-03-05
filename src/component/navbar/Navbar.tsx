import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { isTokenExpired } from "../../UIkit/accessTokenVerify/accesstokenverify";
import AvatarWithInitials from "../../UIkit/AvatarWithInitials/AvatarWithInitials";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [mobileMenu, setMobileMenu] = useState(false); // Mobile menu toggle state
  const navigate = useNavigate();
  // Handle login functionality
  const handleLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    const valid = isTokenExpired(localStorage.getItem("token"));
    if (valid) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  });
  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-head">
          <div className="navbar-logo">LezDo TechMed</div>
          {/* Navigation Links */}
          <div className={`navbar-links ${mobileMenu ? "active" : ""}`}>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              {isLoggedIn && (
                <li>
                  <a href="/StockPortfolio">My Portfolio</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* User or Login Button */}
        <div className="navbar-user">
          {!isLoggedIn ? (
            <button onClick={handleLogin} className="login-btn">
              Login
            </button>
          ) : (
            <div className="user-info" onClick={handleLogout}>
              <AvatarWithInitials
                name={localStorage.getItem("username")?.toString()}
                width="50px"
                height="50px"
              />
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
