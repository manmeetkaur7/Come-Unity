import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import VolunteerLayout from "./layouts/VolunteerLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";
import AdminLayout from "./layouts/AdminLayout";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import favoriteIcon from "@/assets/Favorite.png";
import reactIcon from "@/assets/react.svg";
import locationIcon from "@/assets/location icon 1.png";
import "./event-details.css";
import selfCareImage from "@/assets/self care image 1.png";

const mockEvent = {
  id: "evt-101",
  title: "Community Garden Cleanup",
  category: "Volunteer",
  date: "2025-02-15",
  startTime: "09:00 AM",
  endTime: "12:00 PM",
  location: {
    name: "Oak Park Community Garden",
    address: "3415 Martin Luther King Jr Blvd, Sacramento, CA",
  },
  description:
    "Help us prepare the community garden for spring planting. We’ll be pruning, mulching, and refreshing the pollinator beds. Gloves and tools are provided. All ages welcome!",
  imageUrl: selfCareImage,
  organizer: {
    name: "Marina Flores",
    email: "marina@seedcollective.org",
    phone: "(916) 555-2100",
  },
  slots: {
    filled: 18,
    total: 30,
  },
  status: "pending", // pending | approved
};

const layoutMap = {
  volunteer: VolunteerLayout,
  organizer: OrganizerLayout,
  admin: AdminLayout,
};

const navConfig = {
  volunteer: [
    { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
    {
      label: "Saved Events",
      href: "/events/saved",
      icon: favoriteIcon,
      iconAlt: "Saved",
    },
    { label: "Dashboard", href: "/dashboard", icon: reactIcon, iconAlt: "Dashboard" },
  ],
  organizer: [
    { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
    { label: "Create Event", href: "/events/create", icon: reactIcon, iconAlt: "Create" },
    { label: "Dashboard", href: "/dashboard", icon: reactIcon, iconAlt: "Dashboard" },
  ],
  admin: [
    { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
    { label: "Dashboard", href: "/dashboard/admin", icon: reactIcon, iconAlt: "Dashboard" },
  ],
};

export default function EventDetails({ user }) {
  const role = user?.role ?? "volunteer";
  const Layout = layoutMap[role] ?? VolunteerLayout;
  const navLinks = navConfig[role] ?? navConfig.volunteer;

  const [event] = useState(mockEvent);
  const [loading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [adminStatus, setAdminStatus] = useState(mockEvent.status);

  const notFound = !loading && !event;

  const metaItems = useMemo(() => {
    if (!event) {
      return [];
    }
    return [
      {
        label: "Category",
        value: event.category,
      },
      {
        label: "Date & Time",
        value: `${new Date(event.date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })} · ${event.startTime} – ${event.endTime}`,
      },
      {
        label: "Location",
        value: (
          <>
            <strong>{event.location.name}</strong>
            <br />
            {event.location.address}
          </>
        ),
      },
      {
        label: "Organizer",
        value: (
          <>
            {event.organizer.name}
            <br />
            <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a>
            <br />
            <a href={`tel:${event.organizer.phone}`}>{event.organizer.phone}</a>
          </>
        ),
      },
    ];
  }, [event]);

  const volunteerActions =
    role === "volunteer" ? (
      <div className="event-details__actions">
        <button
          type="button"
          className={`event-details__cta${
            signedUp ? " event-details__cta--secondary" : ""
          }`}
          onClick={() => setSignedUp((value) => !value)}
        >
          {signedUp ? "Unsign" : "Sign Up"}
        </button>
        <button
          type="button"
          className="event-details__ghost"
          onClick={() => setSaved((value) => !value)}
        >
          {saved ? "Unsave" : "Save for later"}
        </button>
      </div>
    ) : null;

  const adminActions =
    role === "admin" && adminStatus === "pending" ? (
      <div className="event-details__actions event-details__actions--admin">
        <button
          type="button"
          className="event-details__ghost event-details__ghost--danger"
          onClick={() => setAdminStatus("denied")}
        >
          Deny
        </button>
        <button
          type="button"
          className="event-details__cta"
          onClick={() => setAdminStatus("approved")}
        >
          Approve
        </button>
      </div>
    ) : null;

  if (role === "admin" && !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout
      navLinks={navLinks}
      roleLabel={role}
      logoSrc={logoClear}
      profileIcon={profileBadge}
    >
      <div className="event-details">
        {loading && (
          <div className="event-details__loading">
            <p>Loading event details...</p>
          </div>
        )}

        {notFound && (
          <div className="event-details__empty">
            <h2>Event not found</h2>
            <p>The event you are looking for is no longer available.</p>
            <a className="event-details__ghost" href="/events">
              Back to Events
            </a>
          </div>
        )}

        {!loading && event && (
          <>
            <header className="event-details__header">
              <div>
                <p className="event-details__eyebrow">{event.category}</p>
                <h1>{event.title}</h1>
                <p className="event-details__slots">
                  {event.slots.filled}/{event.slots.total} volunteers signed up
                </p>
              </div>
              {role === "organizer" && (
                <span className="event-details__organizer-badge">
                  Organizer view
                </span>
              )}
              {role === "admin" && (
                <span
                  className={`event-details__status event-details__status--${adminStatus}`}
                >
                  {adminStatus === "pending" ? "Pending approval" : adminStatus}
                </span>
              )}
            </header>

            {event.imageUrl && (
              <section className="event-details__layout">
                <div className="event-details__image">
                  <img src={event.imageUrl} alt={event.title} />
                </div>
                <div className="event-details__meta-grid">
                  {metaItems.map((item) => (
                    <article key={item.label}>
                      <span>{item.label}</span>
                      <p>{item.value}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {event.description && (
              <section className="event-details__section">
                <h2>About this event</h2>
                <p>{event.description}</p>
              </section>
            )}

            <section className="event-details__section event-details__section--highlight">
              <div className="event-details__highlight">
                <img src={locationIcon} alt="" />
                <div>
                  <p>Meeting Point</p>
                  <strong>{event.location.name}</strong>
                  <span>{event.location.address}</span>
                </div>
              </div>

              <div className="event-details__highlight">
                <img src={favoriteIcon} alt="" />
                <div>
                  <p>Volunteer Count</p>
                  <strong>
                    {event.slots.filled}/{event.slots.total}
                  </strong>
                  <span>spots filled</span>
                </div>
              </div>
            </section>

            {volunteerActions}
            {adminActions}
          </>
        )}
      </div>
    </Layout>
  );
}
