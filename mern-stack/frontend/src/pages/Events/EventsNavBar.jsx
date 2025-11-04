import React from "react";
import "./events.css";

export default function EventsNavBar({
  navLinks = [],
  roleLabel = "",
  variant = "volunteer",
}) {
  return (
    <header className={`events-nav events-nav--${variant}`}>
      <div className="events-nav__left">
        <div className="events-nav__logo" aria-label="Come-Unity home">
          Come-Unity
        </div>
        <nav className="events-nav__links" aria-label="Events navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
              className={`events-nav__link ${
                link.active ? "events-nav__link--active" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="events-nav__right">
        <div className="events-nav__profile">
          <div className="events-nav__avatar">{roleLabel?.[0] ?? "?"}</div>
          <span className="events-nav__role">{roleLabel}</span>
        </div>
      </div>
    </header>
  );
}
