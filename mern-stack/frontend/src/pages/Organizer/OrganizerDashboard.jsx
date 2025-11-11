import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import OrganizerLayout from "@/pages/Events/layouts/OrganizerLayout";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import addEventIcon from "@/assets/add-event.png";
import dashboardIcon from "@/assets/dashboard.png";
import locationIcon from "@/assets/location icon 1.png";
import "./organizer-dashboard.css";

const organizerNavLinks = [
  { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
  { label: "Create Event", href: "/events/create", icon: addEventIcon, iconAlt: "Create" },
  {
    label: "Dashboard",
    href: "/dashboard/organizer",
    icon: dashboardIcon,
    iconAlt: "Organizer dashboard",
  },
];

const mockOrganizerPayload = {
  metrics: {
    upcomingEvents: 4,
    totalVolunteers: 128,
    eventsCreated: 18,
  },
  events: [
    {
      id: "evt-510",
      title: "Harvest Festival Community Lunch",
      date: "2025-02-04",
      startTime: "11:00 AM",
      location: "McKinley Park",
      volunteers: { signedUp: 26, total: 40 },
      status: "publishing",
      owned: true,
    },
    {
      id: "evt-511",
      title: "Parent Literacy Night",
      date: "2025-02-10",
      startTime: "06:30 PM",
      location: "Oak Ridge Elementary",
      volunteers: { signedUp: 18, total: 25 },
      status: "scheduled",
      owned: true,
    },
    {
      id: "evt-489",
      title: "Neighborhood Cleanup Corridor",
      date: "2025-01-28",
      startTime: "08:00 AM",
      location: "Franklin Blvd",
      volunteers: { signedUp: 32, total: 35 },
      status: "scheduled",
      owned: false,
    },
    {
      id: "evt-472",
      title: "Winter Coat Sorting Party",
      date: "2024-12-18",
      startTime: "05:30 PM",
      location: "Seed Collective HQ",
      volunteers: { signedUp: 24, total: 24 },
      status: "completed",
      owned: false,
    },
  ],
};

const statusCopy = {
  publishing: "Awaiting publish",
  scheduled: "Scheduled",
  completed: "Completed",
};

const formatDate = (value) => {
  if (!value) return "TBD";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function OrganizerDashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({ metrics: null, events: [] });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const navLinks = useMemo(
    () =>
      organizerNavLinks.map((link) =>
        link.href === "/dashboard/organizer"
          ? { ...link, active: true }
          : { ...link, active: false }
      ),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData(mockOrganizerPayload);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const isOrganizer = user?.role === "organizer";
  if (user && !isOrganizer) {
    return <Navigate to="/events" replace />;
  }

  const handleEditEvent = (targetEvent) => {
    setToastMessage(`Edit flow coming soon for “${targetEvent.title}”.`);
  };

  const handleDeleteEventRequest = (targetEvent) => {
    setPendingDelete(targetEvent);
  };

  const cancelDeleteRequest = () => setPendingDelete(null);

  const confirmDeleteEvent = () => {
    if (!pendingDelete) {
      return;
    }
    setDashboardData((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== pendingDelete.id),
      metrics: current.metrics
        ? {
            ...current.metrics,
            upcomingEvents: Math.max(
              0,
              (current.metrics.upcomingEvents ?? 0) - (pendingDelete.status === "completed" ? 0 : 1)
            ),
            eventsCreated: Math.max(0, (current.metrics.eventsCreated ?? 0) - 1),
          }
        : current.metrics,
    }));
    setToastMessage(`“${pendingDelete.title}” removed from your dashboard.`);
    setPendingDelete(null);
  };

  const dismissToast = () => setToastMessage("");

  const metrics = useMemo(() => {
    const base = dashboardData.metrics ?? {};
    return {
      upcomingEvents: base.upcomingEvents ?? 0,
      totalVolunteers: base.totalVolunteers ?? 0,
      eventsCreated: base.eventsCreated ?? 0,
    };
  }, [dashboardData.metrics]);

  const metricCards = [
    {
      label: "Upcoming Events",
      value: metrics.upcomingEvents,
      helper: "On the calendar",
    },
    {
      label: "Total Volunteers Signed Up",
      value: metrics.totalVolunteers,
      helper: "Across active events",
    },
    {
      label: "Events Created",
      value: metrics.eventsCreated,
      helper: "All time",
    },
  ];

  const hasEvents = dashboardData.events.length > 0;

  return (
    <OrganizerLayout
      navLinks={navLinks}
      roleLabel="Organizer"
      logoSrc={logoClear}
      profileIcon={profileBadge}
    >
      <div className="organizer-dashboard">
        <header className="organizer-dashboard__header">
          <div>
            <p className="organizer-dashboard__eyebrow">Upcoming schedules</p>
            <h1>Organizer Dashboard</h1>
            <p>Monitor signups, track live events, and keep everything moving.</p>
          </div>
          <div className="organizer-dashboard__status">
            {loading ? "Checking events" : "All event data current"}
          </div>
        </header>

        {toastMessage && (
          <div className="organizer-dashboard__toast" role="status">
            <span>{toastMessage}</span>
            <button type="button" onClick={dismissToast} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        )}

        <section className="organizer-dashboard__metrics" aria-live="polite">
          {metricCards.map((metric) => (
            <article
              key={metric.label}
              className={`organizer-dashboard__metric${
                loading ? " organizer-dashboard__metric--loading" : ""
              }`}
            >
              {loading ? (
                <>
                  <span className="organizer-dashboard__skeleton organizer-dashboard__skeleton--label" />
                  <span className="organizer-dashboard__skeleton organizer-dashboard__skeleton--value" />
                  <span className="organizer-dashboard__skeleton organizer-dashboard__skeleton--helper" />
                </>
              ) : (
                <>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.helper}</small>
                </>
              )}
            </article>
          ))}
        </section>

        <section className="organizer-dashboard__section">
          <div className="organizer-dashboard__section-header">
            <div>
              <p>Event roster</p>
              <h2>Your created events</h2>
            </div>
            {!loading && (
              <a className="organizer-dashboard__action" href="/events/create">
                + Create event
              </a>
            )}
          </div>

          {loading ? (
            <div className="organizer-dashboard__list-skeleton">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="organizer-dashboard__row-skeleton" />
              ))}
            </div>
          ) : hasEvents ? (
            <ul className="organizer-dashboard__event-list">
              {dashboardData.events.map((event) => {
                const percentFilled = event.volunteers.total
                  ? Math.min(
                      100,
                      Math.round((event.volunteers.signedUp / event.volunteers.total) * 100)
                    )
                  : 0;
                return (
                  <li key={event.id} className="organizer-dashboard__event">
                    <div className="organizer-dashboard__event-main">
                      <div>
                        <div className="organizer-dashboard__status-stack">
                          <span
                            className={`organizer-dashboard__status-pill organizer-dashboard__status-pill--${event.status}`}
                          >
                            {statusCopy[event.status] ?? event.status}
                          </span>
                          {event.owned ? (
                            <span className="organizer-dashboard__ownership-pill">Your event</span>
                          ) : (
                            <span className="organizer-dashboard__ownership-pill organizer-dashboard__ownership-pill--muted">
                              External event
                            </span>
                          )}
                        </div>
                        <h3>{event.title}</h3>
                        <p>
                          {formatDate(event.date)} · {event.startTime}
                          <span className="organizer-dashboard__event-location">
                            <img src={locationIcon} alt="" aria-hidden="true" />
                            {event.location}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="organizer-dashboard__event-meta">
                      <div className="organizer-dashboard__volunteer-count">
                        <strong>
                          {event.volunteers.signedUp}/{event.volunteers.total}
                        </strong>
                        <span>volunteers</span>
                      </div>
                      <div className="organizer-dashboard__progress">
                        <div
                          className="organizer-dashboard__progress-bar"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                    {event.owned && (
                      <div className="organizer-dashboard__event-actions">
                        <button
                          type="button"
                          className="organizer-dashboard__btn"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit Event
                        </button>
                        <button
                          type="button"
                          className="organizer-dashboard__btn organizer-dashboard__btn--danger"
                          onClick={() => handleDeleteEventRequest(event)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="organizer-dashboard__empty">
              <h3>No events yet</h3>
              <p>Start a new experience to see stats on signups and activity.</p>
              <a className="organizer-dashboard__action organizer-dashboard__action--ghost" href="/events/create">
                Create your first event
              </a>
            </div>
          )}
        </section>
      </div>

      {pendingDelete && (
        <div className="organizer-dashboard__modal" role="dialog" aria-modal="true" aria-label="Delete event">
          <div className="organizer-dashboard__modal-card">
            <h3>Delete this event?</h3>
            <p>
              “{pendingDelete.title}” will be removed from your dashboard. This is a mock action for
              now, but it demonstrates the upcoming workflow.
            </p>
            <div className="organizer-dashboard__modal-actions">
              <button type="button" onClick={cancelDeleteRequest}>
                Keep Event
              </button>
              <button type="button" className="organizer-dashboard__btn organizer-dashboard__btn--danger" onClick={confirmDeleteEvent}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </OrganizerLayout>
  );
}
