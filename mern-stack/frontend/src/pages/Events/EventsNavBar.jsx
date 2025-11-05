import React from "react";
import "./events.css";

export default function EventsNavBar({
  navLinks = [],
  roleLabel = "",
  variant = "volunteer",
  logoSrc,
  profileIcon,
}) {
  return (
    <header className={`events-nav events-nav--${variant}`}>
      <div className="events-nav__left">
        {logoSrc ? (
          <img
            className="events-nav__logo-img"
            src={logoSrc}
            alt="Come-Unity logo"
          />
        ) : (
          <div className="events-nav__logo" aria-label="Come-Unity home">
            Come-Unity
          </div>
        )}
        <nav className="events-nav__links" aria-label="Events navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
              className={`events-nav__link ${
                link.active ? "events-nav__link--active" : ""
              }`}
            >
              {link.icon && (
                <span className="events-nav__link-icon" aria-hidden="true">
                  <img src={link.icon} alt={link.iconAlt ?? ""} />
                </span>
              )}
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="events-nav__right">
        <div className="events-nav__profile">
          {profileIcon && (
            <img
              className="events-nav__profile-icon"
              src={profileIcon}
              alt={`${roleLabel} badge`}
            />
          )}
          <span className="events-nav__role">{roleLabel}</span>
        </div>
      </div>
    </header>
  );
}
