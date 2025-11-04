import React from "react";
import EventsNavBar from "./EventsNavBar";

export function VolunteerNavBar({ navLinks, roleLabel = "Volunteer" }) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="volunteer"
    />
  );
}
