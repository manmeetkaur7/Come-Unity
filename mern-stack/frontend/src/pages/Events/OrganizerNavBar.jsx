import React from "react";
import EventsNavBar from "./EventsNavBar";

export function OrganizerNavBar({
  navLinks,
  roleLabel = "Organizer",
  logoSrc,
  profileIcon,
}) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="organizer"
      logoSrc={logoSrc}
      profileIcon={profileIcon}
    />
  );
}
