import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/ministries", label: "Ministries" },
  { to: "/missions", label: "Missions" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__row">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__mark">K</span>
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
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) => "navbar__link navbar__link--admin" + (isActive ? " is-active" : "")}
            onClick={() => setOpen(false)}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
