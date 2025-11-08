import React from "react";
import { AdminNavBar } from "../AdminNavBar";

export default function AdminLayout({
  children,
  navLinks,
  roleLabel,
  logoSrc,
  profileIcon,
}) {
  return (
    <div className="layout admin-layout">
      <AdminNavBar
        navLinks={navLinks}
        roleLabel={roleLabel}
        logoSrc={logoSrc}
        profileIcon={profileIcon}
      />
      <main className="events-content">{children}</main>
    </div>
  );
}
