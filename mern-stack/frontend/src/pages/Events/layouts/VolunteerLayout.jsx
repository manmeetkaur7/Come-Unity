import React from "react";
import { VolunteerNavBar } from "../VolunteerNavBar";

export default function VolunteerLayout({
  children,
  navLinks,
  roleLabel,
  logoSrc,
  profileIcon,
}) {
  return (
    <div className="layout volunteer-layout">
      <VolunteerNavBar
        navLinks={navLinks}
        roleLabel={roleLabel}
        logoSrc={logoSrc}
        profileIcon={profileIcon}
      />
      <main className="events-content">{children}</main>
    </div>
  );
}
