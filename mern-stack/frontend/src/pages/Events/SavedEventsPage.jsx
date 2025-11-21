import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import VolunteerLayout from "@/pages/Events/layouts/VolunteerLayout";
import EventCard from "@/pages/Events/EventCard";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import favoriteIcon from "@/assets/Favorite.png";
import dashboardIcon from "@/assets/dashboard.png";
import selfCareImage from "@/assets/self care image 1.png";
import libraryImage from "@/assets/3 7.png";
import nutritionImage from "@/assets/Untitled design 1.png";
import "./saved-events.css";

const volunteerNavLinks = [
  { label: "Events", href: "/events", icon: calendarIcon, iconAlt: "Events" },
  {
    label: "Saved Events",
    href: "/events/saved",
    icon: favoriteIcon,
    iconAlt: "Saved events",
  },
  {
    label: "Dashboard",
    href: "/dashboard/volunteer",
    icon: dashboardIcon,
    iconAlt: "Volunteer dashboard",
  },
];

const mockSavedEvents = [
  {
    id: "evt-701",
    title: "Community Garden Prep Day",
    category: "Volunteer",
    description: "Help tidy the raised beds and refresh soil before planting.",
    slotsAvailable: 6,
    slotsTotal: 24,
    imageUrl: selfCareImage,
    isSaved: true,
  },
  {
    id: "evt-702",
    title: "Riverfront Storytime",
    category: "Education",
    description: "Assist with crafts and story circles for early readers.",
    slotsAvailable: 4,
    slotsTotal: 18,
    imageUrl: libraryImage,
    isSaved: true,
  },
  {
    id: "evt-703",
    title: "Wellness Kit Assembly",
    category: "Health",
    description: "Assemble hygiene kits to distribute at local shelters.",
    slotsAvailable: 10,
    slotsTotal: 30,
    imageUrl: nutritionImage,
    isSaved: true,
  },
];

export default function SavedEventsPage({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const navLinks = useMemo(
    () =>
      volunteerNavLinks.map((link) =>
        link.href === "/events/saved"
          ? { ...link, active: true }
          : { ...link, active: false }
      ),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockSavedEvents);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const isVolunteer = user?.role ? user.role === "volunteer" : true;
  if (user && !isVolunteer) {
    return <Navigate to="/events" replace />;
  }

  const handleUnsave = (eventId) => {
    setEvents((current) => current.filter((event) => event.id !== eventId));
  };

  const savedCount = events.length;

  return (
    <VolunteerLayout
      navLinks={navLinks}
      roleLabel="Volunteer"
      logoSrc={logoClear}
      profileIcon={profileBadge}
      onLogout={onLogout}
    >
      <div className="saved-events">
        <header className="saved-events__header">
          <div>
            <p className="saved-events__eyebrow">Bookmarked opportunities</p>
            <h1>Saved Events</h1>
            <p>Review your short list and lock in the ones you can attend.</p>
          </div>
          <div className="saved-events__badge">
            {loading ? "Loading" : `${savedCount} saved`}
          </div>
        </header>

        {loading ? (
          <div className="saved-events__skeleton-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="saved-events__card-skeleton" />
            ))}
          </div>
        ) : savedCount ? (
          <div className="saved-events__grid">
            {events.map((event) => (
              <article key={event.id} className="saved-events__item">
                <EventCard event={event} />
                <div className="saved-events__actions">
                  <button
                    type="button"
                    className="saved-events__ghost saved-events__ghost--full"
                    onClick={() => handleUnsave(event.id)}
                  >
                    Remove bookmark
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="saved-events__empty">
            <h2>No saved events</h2>
            <p>Tap the heart icon on events to revisit them here when you are ready.</p>
            <a className="saved-events__ghost" href="/events">
              Explore events
            </a>
          </div>
        )}
      </div>
    </VolunteerLayout>
  );
}
