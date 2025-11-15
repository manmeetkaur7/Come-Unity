import React, { useEffect, useMemo, useState } from "react";
// TODO: import api helper when wiring CU-30
import { Navigate } from "react-router-dom";
import VolunteerLayout from "./layouts/VolunteerLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";
import AdminLayout from "./layouts/AdminLayout";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import favoriteIcon from "@/assets/Favorite.png";
import addEventIcon from "@/assets/add-event.png";
import dashboardIcon from "@/assets/dashboard.png";
import locationIcon from "@/assets/location icon 1.png";
import "./event-details.css";
import selfCareImage from "@/assets/self care image 1.png";
import { FaBookmark, FaClock, FaRegBookmark, FaUserCheck } from "react-icons/fa";

// TODO: replace mockEvent with data from GET /api/events/:id (CU-30)
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
  isOwned: true,
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
    {
      label: "Dashboard",
      href: "/dashboard/volunteer",
      icon: dashboardIcon,
      iconAlt: "Dashboard",
    },
  ],
  organizer: [
    { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
    { label: "Create Event", href: "/events/create", icon: addEventIcon, iconAlt: "Create" },
    {
      label: "Dashboard",
      href: "/dashboard/organizer",
      icon: dashboardIcon,
      iconAlt: "Dashboard",
    },
  ],
  admin: [
    { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: dashboardIcon,
      iconAlt: "Dashboard",
    },
  ],
};

const parseTimeToMinutes = (timeString) => {
  if (!timeString) {
    return null;
  }
  const [timePart, period] = timeString.split(" ");
  if (!timePart || !period) {
    return null;
  }
  const [hourStr, minuteStr] = timePart.split(":");
  if (!hourStr || !minuteStr) {
    return null;
  }
  let hours = Number(hourStr);
  const minutes = Number(minuteStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};

export default function EventDetails({ user }) {
  const role = user?.role ?? "volunteer";
  const Layout = layoutMap[role] ?? VolunteerLayout;
  const navLinks = navConfig[role] ?? navConfig.volunteer;

  const [event] = useState(mockEvent); // TODO: load event from API based on id (CU-30)
  const [loading] = useState(false); // TODO: drive loading state from fetch (CU-31)
  const [saved, setSaved] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [adminStatus, setAdminStatus] = useState(mockEvent.status); // TODO: set from fetched event status (CU-30/CU-33)
  const [selectedHours, setSelectedHours] = useState("");
  const [organizerNotice, setOrganizerNotice] = useState("");
  const [showOrganizerDeleteConfirm, setShowOrganizerDeleteConfirm] = useState(false);

  const durationInfo = useMemo(() => {
    const start = parseTimeToMinutes(event?.startTime);
    const end = parseTimeToMinutes(event?.endTime);
    if (start === null || end === null || end <= start) {
      return { durationMinutes: 60, hours: 1 };
    }
    const minutes = end - start;
    const wholeHours = Math.max(1, Math.floor(minutes / 60));
    return { durationMinutes: minutes, hours: wholeHours };
  }, [event?.startTime, event?.endTime]);

  useEffect(() => {
    setSelectedHours("");
  }, [durationInfo.hours]);

  const volunteerHourOptions = useMemo(
    () => Array.from({ length: durationInfo.hours }, (_, index) => index + 1),
    [durationInfo.hours]
  );

  const selectedHoursCount = Number(selectedHours) || 0;
  const selectedHoursText =
    selectedHoursCount > 0
      ? `${selectedHoursCount} ${selectedHoursCount === 1 ? "hour" : "hours"}`
      : null;
  const availableHoursText = `${durationInfo.hours} ${
    durationInfo.hours === 1 ? "hour" : "hours"
  }`;
  const disableSignupCta = !selectedHoursCount && !signedUp;

  const volunteerHelperText = selectedHoursText
    ? `We'll log ${selectedHoursText} for this event.`
    : `You can commit up to ${availableHoursText}.`;

  const handleHoursChange = (event) => {
    setSelectedHours(event.target.value);
  };

  const handleSignupToggle = () => {
    if (!signedUp && !selectedHoursCount) {
      return;
    }
    setSignedUp((value) => !value);
  };

  const handleOrganizerEdit = () => {
    if (!canOrganizerManage) {
      return;
    }
    setOrganizerNotice("Edit mode coming soon — this is a placeholder action for now.");
  };

  const handleOrganizerDeletePrompt = () => {
    if (!canOrganizerManage) {
      return;
    }
    setShowOrganizerDeleteConfirm(true);
  };

  const cancelOrganizerDelete = () => setShowOrganizerDeleteConfirm(false);

  const confirmOrganizerDelete = () => {
    if (!canOrganizerManage) {
      return;
    }
    setShowOrganizerDeleteConfirm(false);
    setOrganizerNotice("This event would be deleted once backend support is added.");
  };

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

  const canOrganizerManage = role === "organizer" && event?.isOwned;

  const volunteerActions =
    role === "volunteer" ? (
      <section
        className="event-details__volunteer-panel"
        aria-labelledby="volunteer-actions-heading"
      >
        <header className="event-details__volunteer-header">
          <div>
            <p className="event-details__eyebrow event-details__eyebrow--muted">
              Volunteer actions
            </p>
            <h3 id="volunteer-actions-heading">
              {signedUp ? "You're on the schedule" : "Secure your volunteer spot"}
            </h3>
            <p className="event-details__volunteer-subcopy">
              {signedUp
                ? selectedHoursText
                  ? `Thanks for committing ${selectedHoursText}. Adjust your hours anytime.`
                  : "Thanks for signing up! Update your hours anytime."
                : "Pick how long you can help and lock in your RSVP."}
            </p>
          </div>
          <span
            className={`event-details__pill${
              signedUp ? " event-details__pill--success" : ""
            }`}
          >
            {signedUp ? <FaUserCheck aria-hidden="true" /> : <FaClock aria-hidden="true" />}
            {signedUp && selectedHoursText
              ? selectedHoursText
              : `Up to ${availableHoursText}`}
          </span>
        </header>

        <div className="event-details__volunteer-grid">
          <label className="event-details__field">
            <span>Hours you're contributing</span>
            <div className="event-details__select-wrapper">
              <FaClock aria-hidden="true" />
              <select value={selectedHours} onChange={handleHoursChange}>
                <option value="">Select</option>
                {volunteerHourOptions.map((hour) => (
                  <option key={hour} value={String(hour)}>
                    {hour} {hour === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="event-details__select-caret">
                ▾
              </span>
            </div>
            <small>{volunteerHelperText}</small>
          </label>

          <div className="event-details__button-stack">
            <button
              type="button"
              className={`event-details__cta event-details__cta--full${
                signedUp ? " event-details__cta--secondary" : ""
              }`}
              disabled={disableSignupCta}
              onClick={handleSignupToggle}
            >
              {signedUp ? "Cancel RSVP" : "Sign up"}
            </button>
            <button
              type="button"
              className={`event-details__ghost event-details__ghost--full${
                saved ? " event-details__ghost--active" : ""
              }`}
              onClick={() => setSaved((value) => !value)}
            >
              {saved ? (
                <>
                  <FaBookmark aria-hidden="true" />
                  <span>Saved to your list</span>
                </>
              ) : (
                <>
                  <FaRegBookmark aria-hidden="true" />
                  <span>Save for later</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
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
                <div className="event-details__organizer-tools">
                  <span className="event-details__organizer-badge">
                    Organizer view
                  </span>
                  {event?.isOwned ? (
                    <>
                      <span className="event-details__ownership-pill">You created this</span>
                      <div className="event-details__organizer-actions">
                        <button
                          type="button"
                          className="event-details__action-btn"
                          onClick={handleOrganizerEdit}
                          disabled={!canOrganizerManage}
                        >
                          Edit Event
                        </button>
                        <button
                          type="button"
                          className="event-details__action-btn event-details__action-btn--danger"
                          onClick={handleOrganizerDeletePrompt}
                          disabled={!canOrganizerManage}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="event-details__ownership-pill event-details__ownership-pill--muted">
                      External event
                    </span>
                  )}
                </div>
              )}
              {role === "admin" && (
                <span
                  className={`event-details__status event-details__status--${adminStatus}`}
                >
                  {adminStatus === "pending" ? "Pending approval" : adminStatus}
                </span>
              )}
            </header>

            {organizerNotice && canOrganizerManage && (
              <div className="event-details__notice" role="status">
                <span>{organizerNotice}</span>
                <button
                  type="button"
                  aria-label="Dismiss organizer notice"
                  onClick={() => setOrganizerNotice("")}
                >
                  ×
                </button>
              </div>
            )}

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

      {showOrganizerDeleteConfirm && canOrganizerManage && (
        <div className="event-details__modal" role="dialog" aria-modal="true" aria-label="Delete event confirmation">
          <div className="event-details__modal-card">
            <h3>Delete event?</h3>
            <p>
              This is a preview of the organizer controls. Deleting “{event?.title}” will be wired up
              when backend support ships.
            </p>
            <div className="event-details__modal-actions">
              <button type="button" onClick={cancelOrganizerDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="event-details__action-btn event-details__action-btn--danger"
                onClick={confirmOrganizerDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
