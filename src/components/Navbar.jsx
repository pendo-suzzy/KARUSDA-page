import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name, e) => {
    if (window.innerWidth <= 860) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === name ? null : name);
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="navbar">
      <div className="container navbar__row">
        <NavLink to="/" className="navbar__brand" onClick={handleLinkClick}>
          <img src="/sdalogo.png" alt="Seventh-day Adventist Church Logo" className="navbar__logo-img" />
          <span className="navbar__name">
            KARUSDA
            <span className="navbar__sub">Karatina University SDA Church</span>
          </span>
        </NavLink>

        <button
          className="navbar__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {/* Home Link with Dropdown */}
          <div className={`navbar__item-dropdown ${activeDropdown === "home" ? "is-open" : ""}`}>
            <NavLink
              to="/"
              className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
              onClick={(e) => toggleDropdown("home", e)}
            >
              Home <span className="navbar__arrow">▼</span>
            </NavLink>
            <div className="navbar__dropdown">
              <NavLink to="/#announcements" className="navbar__dropdown-link" onClick={handleLinkClick}>
                Announcements
              </NavLink>
              <NavLink to="/#leadership" className="navbar__dropdown-link" onClick={handleLinkClick}>
                Leadership
              </NavLink>
              <NavLink to="/#sermons" className="navbar__dropdown-link" onClick={handleLinkClick}>
                Sermons
              </NavLink>
            </div>
          </div>

          {/* Events Link */}
          <NavLink
            to="/events"
            className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
            onClick={handleLinkClick}
          >
            Events
          </NavLink>

          {/* Ministries Link with Dropdown */}
          <div className={`navbar__item-dropdown ${activeDropdown === "ministries" ? "is-open" : ""}`}>
            <NavLink
              to="/ministries"
              className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
              onClick={(e) => toggleDropdown("ministries", e)}
            >
              Ministries <span className="navbar__arrow">▼</span>
            </NavLink>
            <div className="navbar__dropdown">
              <NavLink to="/ministries#ministries-list" className="navbar__dropdown-link" onClick={handleLinkClick}>
                Ministries
              </NavLink>
              <NavLink to="/ministries#choir" className="navbar__dropdown-link" onClick={handleLinkClick}>
                Choir
              </NavLink>
            </div>
          </div>

          {/* Missions Link */}
          <NavLink
            to="/missions"
            className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
            onClick={handleLinkClick}
          >
            Missions
          </NavLink>

          {/* Admin Link */}
          <NavLink
            to="/admin"
            className={({ isActive }) => "navbar__link navbar__link--admin" + (isActive ? " is-active" : "")}
            onClick={handleLinkClick}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
