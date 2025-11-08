import React from "react";
import EventsNavBar from "./EventsNavBar";

export function AdminNavBar({
  navLinks,
  roleLabel = "Admin",
  logoSrc,
  profileIcon,
}) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="admin"
      logoSrc={logoSrc}
      profileIcon={profileIcon}
    />
  );
}
