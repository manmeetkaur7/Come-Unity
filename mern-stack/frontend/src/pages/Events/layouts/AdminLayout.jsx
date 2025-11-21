import React from "react";
import { AdminNavBar } from "../AdminNavBar";

export default function AdminLayout({
  children,
  navLinks,
  roleLabel,
  logoSrc,
  profileIcon,
  onLogout,
}) {
  return (
    <div className="layout admin-layout">
      <AdminNavBar
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
