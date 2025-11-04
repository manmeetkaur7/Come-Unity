import React from "react";
import { OrganizerNavBar } from "../OrganizerNavBar";

export default function OrganizerLayout({ children, navLinks, roleLabel }) {
  return (
    <div className="layout organizer-layout">
      <OrganizerNavBar navLinks={navLinks} roleLabel={roleLabel} />
      <main className="events-content">{children}</main>
    </div>
  );
}
