import React from "react";
import { OrganizerNavBar } from "../OrganizerNavBar";

export default function OrganizerLayout({
  children,
  navLinks,
  roleLabel,
  logoSrc,
  profileIcon,
  onLogout,
}) {
  return (
    <div className="layout organizer-layout">
      <OrganizerNavBar
        navLinks={navLinks}
        roleLabel={roleLabel}
        logoSrc={logoSrc}
        profileIcon={profileIcon}
        onLogout={onLogout}
      />
      <main className="events-content">{children}</main>
    </div>
  );
}
