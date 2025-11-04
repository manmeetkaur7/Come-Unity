import React from "react";
import EventsNavBar from "./EventsNavBar";

export function AdminNavBar({ navLinks, roleLabel = "Admin" }) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="admin"
    />
  );
}
