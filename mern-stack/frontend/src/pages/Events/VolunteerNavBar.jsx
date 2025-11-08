import React from "react";
import EventsNavBar from "./EventsNavBar";

export function VolunteerNavBar({
  navLinks,
  roleLabel = "Volunteer",
  logoSrc,
  profileIcon,
}) {
  return (
    <EventsNavBar
      navLinks={navLinks}
      roleLabel={roleLabel}
      variant="volunteer"
      logoSrc={logoSrc}
      profileIcon={profileIcon}
    />
  );
}
