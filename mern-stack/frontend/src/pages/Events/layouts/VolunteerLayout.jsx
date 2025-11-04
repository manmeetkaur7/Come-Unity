import React from "react";
import { VolunteerNavBar } from "../VolunteerNavBar";

export default function VolunteerLayout({ children, navLinks, roleLabel }) {
  return (
    <div className="layout volunteer-layout">
      <VolunteerNavBar navLinks={navLinks} roleLabel={roleLabel} />
      <main className="events-content">{children}</main>
    </div>
  );
}
