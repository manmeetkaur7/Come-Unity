import React from "react";
import { AdminNavBar } from "../AdminNavBar";

export default function AdminLayout({ children, navLinks, roleLabel }) {
  return (
    <div className="layout admin-layout">
      <AdminNavBar navLinks={navLinks} roleLabel={roleLabel} />
      <main className="events-content">{children}</main>
    </div>
  );
}
