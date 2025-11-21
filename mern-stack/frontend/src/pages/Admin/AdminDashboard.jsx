import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/pages/Events/layouts/AdminLayout";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import dashboardIcon from "@/assets/dashboard.png";
import "./admin-dashboard.css";

const mockPendingEvents = [
  {
    id: "evt-101",
    title: "Community Garden Cleanup",
    category: "Volunteer",
    organizerName: "Marina Flores",
    organizerEmail: "marina@seedcollective.org",
    submittedAt: "2025-01-08T10:00:00Z",
    status: "pending",
  },
  {
    id: "evt-102",
    title: "Youth Coding Bootcamp",
    category: "Education",
    organizerName: "Derrick Lee",
    organizerEmail: "derrick@codefuture.org",
    submittedAt: "2025-01-07T14:23:00Z",
    status: "pending",
  },
  {
    id: "evt-103",
    title: "Mental Wellness Circle",
    category: "Health",
    organizerName: "Salma Rahman",
    organizerEmail: "salma@calmcollective.com",
    submittedAt: "2025-01-05T09:12:00Z",
    status: "pending",
  },
  {
    id: "evt-104",
    title: "Winter Coat Drive",
    category: "Family",
    organizerName: "Trinity Lawson",
    organizerEmail: "trinity@warmhands.org",
    submittedAt: "2025-01-02T18:41:00Z",
    status: "pending",
  },
  {
    id: "evt-105",
    title: "Neighborhood Story Hour",
    category: "Cultural",
    organizerName: "Luis Romero",
    organizerEmail: "luis@commune.org",
    submittedAt: "2024-12-29T16:05:00Z",
    status: "pending",
  },
  {
    id: "evt-106",
    title: "Food Bank Sorting Day",
    category: "Volunteer",
    organizerName: "Asha Patel",
    organizerEmail: "asha@heartkitchen.org",
    submittedAt: "2024-12-27T11:35:00Z",
    status: "pending",
  },
];

const navLinks = [
  {
    label: "Events",
    href: "/events",
    icon: calendarIcon,
    iconAlt: "Events list",
  },
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    active: true,
    icon: dashboardIcon,
    iconAlt: "Admin dashboard",
  },
];

export default function AdminDashboard({ user, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(4);

  const loadEvents = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setEvents(mockPendingEvents);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cleanup = loadEvents();
    return cleanup;
  }, []);

  const summary = useMemo(() => {
    const pending = events.filter((event) => event.status === "pending").length;
    const approved = events.filter((event) => event.status === "approved").length;
    const denied = events.filter((event) => event.status === "denied").length;
    return { pending, approved, denied };
  }, [events]);

  if (user?.role !== "admin") {
    return <Navigate to="/events" replace />;
  }

  const handleDecision = (eventId, decision) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, status: decision } : event
      )
    );
  };

  const filteredEvents = events.filter((event) => event.status === "pending");
  const visibleEvents = filteredEvents.slice(0, visible);
  const showLoadMore = visible < filteredEvents.length;

  const handleRefresh = () => {
    setVisible(4);
    loadEvents();
  };

  return (
    <AdminLayout
      navLinks={navLinks}
      roleLabel="Admin"
      logoSrc={logoClear}
      profileIcon={profileBadge}
      onLogout={onLogout}
    >
      <div className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <p className="admin-dashboard__eyebrow">Admin Control Center</p>
            <h1>Pending Event Approvals</h1>
            <p className="admin-dashboard__description">
              Review each submission before it goes live to the Come-Unity network.
            </p>
          </div>
          <button
            type="button"
            className="admin-dashboard__refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh List
          </button>
        </header>

        <section className="admin-dashboard__stats">
          <article>
            <span>Pending</span>
            <strong>{summary.pending}</strong>
          </article>
          <article>
            <span>Approved Today</span>
            <strong>{summary.approved}</strong>
          </article>
          <article>
            <span>Denied Today</span>
            <strong>{summary.denied}</strong>
          </article>
        </section>

        <section className="admin-dashboard__list">
          <div className="admin-dashboard__list-header">
            <h2>Awaiting Review</h2>
            <span>
              Showing {visibleEvents.length} of {filteredEvents.length} pending events
            </span>
          </div>

          {loading && (
            <div className="admin-dashboard__skeleton">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="admin-dashboard__skeleton-card" />
              ))}
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="admin-dashboard__empty">
              <p>All caught up! No events are waiting for approval.</p>
            </div>
          )}

          {!loading && filteredEvents.length > 0 && (
            <>
              <ol className="admin-dashboard__cards">
                {visibleEvents.map((event) => (
                  <li key={event.id} className="admin-event-card">
                    <div className="admin-event-card__header">
                      <a className="admin-event-card__title" href={`/events/${event.id}`}>
                        {event.title}
                      </a>
                      <span className="admin-event-card__tag">{event.category}</span>
                    </div>
                    <dl className="admin-event-card__details">
                      <div>
                        <dt>Organizer</dt>
                        <dd>{event.organizerName}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>
                          <a href={`mailto:${event.organizerEmail}`}>
                            {event.organizerEmail}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt>Submitted</dt>
                        <dd>
                          {new Date(event.submittedAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </dd>
                      </div>
                    </dl>
                    <div className="admin-event-card__actions">
                      <button
                        type="button"
                        className="admin-event-card__button admin-event-card__button--deny"
                        onClick={() => handleDecision(event.id, "denied")}
                      >
                        Deny
                      </button>
                      <button
                        type="button"
                        className="admin-event-card__button admin-event-card__button--approve"
                        onClick={() => handleDecision(event.id, "approved")}
                      >
                        Approve
                      </button>
                      <a
                        className="admin-event-card__button admin-event-card__button--details"
                        href={`/events/${event.id}`}
                      >
                        More Details
                      </a>
                    </div>
                  </li>
                ))}
              </ol>

              {showLoadMore && (
                <button
                  type="button"
                  className="admin-dashboard__load-more"
                  onClick={() => setVisible((value) => value + 3)}
                >
                  Load more
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
