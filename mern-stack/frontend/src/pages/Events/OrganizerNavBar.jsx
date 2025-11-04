import React from "react";
import EventsNavBar from "./EventsNavBar";

export function OrganizerNavBar({ navLinks, roleLabel = "Organizer" }) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="organizer"
    />
  );
}
