import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  {
    to: "/",
    label: "Home",
    dropdown: [
      { to: "/#announcements", label: "Announcements" },
      { to: "/#leaders", label: "Leaders" },
      { to: "/#sermons", label: "Sermons" }
    ]
  },
  { to: "/events", label: "Events" },
  {
    to: "/ministries",
    label: "Ministries",
    dropdown: [
      { to: "/ministries#ministries", label: "Ministries" },
      { to: "/ministries#choir", label: "Choir" }
    ]
  },
  { to: "/missions", label: "Missions" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (label, e) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="navbar">
      <div className="container navbar__row">
        <NavLink to="/" className="navbar__brand" onClick={() => { setOpen(false); setActiveDropdown(null); }}>
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
          {LINKS.map((link) => (
            <div 
              key={link.to} 
              className={`navbar__item ${link.dropdown ? 'has-dropdown' : ''} ${activeDropdown === link.label ? 'dropdown-active' : ''}`}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) => "navbar__link" + (isActive && !link.dropdown ? " is-active" : "")}
                onClick={(e) => {
                  if (link.dropdown && window.innerWidth <= 860) {
                    toggleDropdown(link.label, e);
                  } else {
                    setOpen(false);
                    setActiveDropdown(null);
                  }
                }}
              >
                {link.label}
                {link.dropdown && <span className="dropdown-arrow">▾</span>}
              </NavLink>
              
              {link.dropdown && (
                <div className="navbar__dropdown">
                  {link.dropdown.map(dropItem => (
                    <a
                      key={dropItem.to}
                      href={dropItem.to}
                      className="navbar__dropdown-link"
                      onClick={() => {
                        setOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      {dropItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) => "navbar__link navbar__link--admin" + (isActive ? " is-active" : "")}
            onClick={() => { setOpen(false); setActiveDropdown(null); }}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
