// src/pages/Events/EventsPage.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import VolunteerLayout from "./layouts/VolunteerLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";
import AdminLayout from "./layouts/AdminLayout";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import favoriteIcon from "@/assets/Favorite.png";
import addEventIcon from "@/assets/add-event.png";
import dashboardIcon from "@/assets/dashboard.png";
import selfCareImage from "@/assets/self care image 1.png";
import libraryImage from "@/assets/5 6.png";
import TrickImage from "@/assets/Untitled design 1.png";
import nutritionImage from "@/assets/6 2.png";
import wellnessImage from "@/assets/1 3.png";
import foodBankImage from "@/assets/6 2.png";
import diversityImage from "@/assets/7 1.png";
import educationImage from "@/assets/5 6.png";
import "./events.css";

const roleConfig = {
  volunteer: {
    variant: "volunteer",
    navLinks: [
      {
        label: "Events",
        href: "/events",
        active: true,
        icon: calendarIcon,
        iconAlt: "Calendar icon",
      },
      {
        label: "Saved Events",
        href: "/events/saved",
        icon: favoriteIcon,
        iconAlt: "Saved events icon",
      },
      {
        label: "Dashboard",
        href: "/dashboard/volunteer",
        icon: dashboardIcon,
        iconAlt: "Dashboard icon",
      },
    ],
    roleLabel: "Volunteer",
    title: "Discover Community Event",
    subtitle: "Find opportunities that match your interests",
    eventsHeading: "Up Coming Events...",
    showFavorites: true,
    showCreateButton: false,
    logoSrc: logoClear,
    profileIcon: profileBadge,
  },
  organizer: {
    variant: "organizer",
    navLinks: [
      {
        label: "Events",
        href: "/events",
        active: true,
        icon: calendarIcon,
        iconAlt: "Calendar icon",
      },
      {
        label: "Create Event",
        href: "/events/create",
        icon: addEventIcon,
        iconAlt: "Create event icon",
      },
      {
        label: "Dashboard",
        href: "/dashboard/organizer",
        icon: dashboardIcon,
        iconAlt: "Dashboard icon",
      },
    ],
    roleLabel: "Organizer",
    title: "Discover Community Event",
    subtitle: "Find opportunities that match your interests",
    eventsHeading: "Up Coming Events...",
    showFavorites: false,
    showCreateButton: true,
    createButtonLabel: "Create Event",
    logoSrc: logoClear,
    profileIcon: profileBadge,
  },
  admin: {
    variant: "admin",
    navLinks: [
      {
        label: "Events",
        href: "/events",
        active: true,
        icon: calendarIcon,
        iconAlt: "Calendar icon",
      },
      {
        label: "Dashboard",
        href: "/dashboard/admin",
        icon: dashboardIcon,
        iconAlt: "Dashboard icon",
      },
    ],
    roleLabel: "Admin",
    title: "Live Community Events",
    subtitle: "Keeping the Community Safe",
    eventsHeading: "Up Coming Events...",
    showFavorites: false,
    showCreateButton: false,
    logoSrc: logoClear,
    profileIcon: profileBadge,
  },
};

const Layouts = {
  volunteer: VolunteerLayout,
  organizer: OrganizerLayout,
  admin: AdminLayout,
};

// Temporary mock data — replace with API later
const mockEvents = [
  {
    id: 1,
    title: "Wellness Market",
    category: "Health",
    description: "Wellness market + community pop-up.",
    slotsAvailable: 3,
    slotsTotal: 45,
    imageUrl: selfCareImage,
    owned: true,
  },
  {
    id: 2,
    title: "Wild Things at Central Library",
    category: "Education",
    description:
      "Live animal ambassadors visit the central library for an interactive storytime, STEM demo, and kid-friendly meet-and-greet that lasts nearly an hour.",
    slotsAvailable: 13,
    slotsTotal: 25,
    imageUrl: libraryImage,
    owned: true,
  },
  {
    id: 3,
    title: "Trick or Treat at Sacramento Children's Museum",
    category: "Family",
    description:
      "Kids can trick-or-treat at the museum on Halloween morning. Gently used or new book donations are requested.",
    slotsAvailable: 9,
    slotsTotal: 40,
    imageUrl: TrickImage,
    owned: false,
  },
  {
    id: 4,
    title: "Food as Medicine Health Conference",
    category: "Health",
    description:
      "Full-day conference on plant-based nutrition and the heart of healing.",
    slotsAvailable: 29,
    slotsTotal: 100,
    imageUrl: nutritionImage,
  },
  {
    id: 5,
    title: "First Responder Mental Health & Wellness Conference",
    category: "Health",
    description:
      "Mental wellness summit for first responders, spouses, and peer-support teams with hands-on workshops, breakouts, and therapy dogs.",
    slotsAvailable: 32,
    slotsTotal: 100,
    imageUrl: wellnessImage,
  },
  {
    id: 6,
    title: "Sacramento Food Bank Volunteer Event",
    category: "Volunteer",
    description:
      "Volunteers help bag fresh produce and sort non-perishable items for distribution throughout the community.",
    slotsAvailable: 20,
    slotsTotal: 25,
    imageUrl: foodBankImage,
  },
  {
    id: 7,
    title: "Voices in Color: A Celebration of Diversity",
    category: "Cultural",
    description: "Art, music, and storytelling celebrating global cultures.",
    slotsAvailable: 17,
    slotsTotal: 65,
    imageUrl: diversityImage,
  },
  {
    id: 8,
    title: "2025 Education Conference (CALCIMA)",
    category: "Education",
    description:
      "Statewide education conference focused on learning, leadership, innovation, and collaboration across the K-12 pipeline with policy updates and teacher-led sessions.",
    slotsAvailable: 57,
    slotsTotal: 100,
    imageUrl: educationImage,
  },
];

export default function EventsPage({ user }) {
  const role = user?.role ?? "volunteer";
  const config = roleConfig[role] ?? roleConfig.volunteer;
  const LayoutComponent = Layouts[role] ?? VolunteerLayout;
  const isOrganizer = role === "organizer";

  const [events, setEvents] = useState(mockEvents);
  const [organizerToast, setOrganizerToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(events.map((event) => event.category).filter(Boolean))
      ),
    [events]
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = selectedCategory
        ? event.category === selectedCategory
        : true;
      if (!matchesCategory) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const haystack = [event.title, event.category, event.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [events, normalizedQuery, selectedCategory]);

  const hasResults = filteredEvents.length > 0;

  const handleOrganizerEdit = (eventItem) => {
    setOrganizerToast(`Edit flow prep for “${eventItem.title}”.`);
  };

  const handleOrganizerDelete = (eventItem) => {
    setEvents((current) => current.filter((event) => event.id !== eventItem.id));
    setOrganizerToast(`“${eventItem.title}” has been removed from the feed.`);
  };

  const dismissOrganizerToast = () => setOrganizerToast("");
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const resetSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleCategoryApply = () => {
    // placeholder for future analytics or to match design; filtering happens automatically
  };

  return (
    <LayoutComponent
      navLinks={config.navLinks}
      roleLabel={config.roleLabel}
      logoSrc={config.logoSrc}
      profileIcon={config.profileIcon}
    >
      <div className="events-shell">
        <section className={`events-hero events-hero--${config.variant}`}>
          <h1 className="events-hero__title">{config.title}</h1>
          <p className="events-hero__subtitle">{config.subtitle}</p>

          <div className="events-toolbar">
            <div className="events-filter">
              <label htmlFor="events-category-input">Category</label>
              <div className="events-filter__field">
                <select
                  id="events-category-input"
                  aria-label="Select category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleCategoryApply}>
                  Apply
                </button>
              </div>
            </div>
            <div className="events-search">
              <label className="events-search__label" htmlFor="events-search-input">
                Search
              </label>
              <div className="events-search__field">
                <input
                  id="events-search-input"
                  type="search"
                  placeholder="Search events by title, category, or keywords"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="events-section">
          <h2 className="events-section__title">{config.eventsHeading}</h2>

          {isOrganizer && organizerToast && (
            <div className="events-toast" role="status">
              <span>{organizerToast}</span>
              <button type="button" onClick={dismissOrganizerToast} aria-label="Dismiss organizer notification">
                ×
              </button>
            </div>
          )}

          {hasResults ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <article key={event.id} className="events-grid__item">
                  <EventCard
                    event={event}
                    showFavorite={config.showFavorites}
                  />
                  {isOrganizer && (
                    <>
                      <div className="events-card-meta">
                        {event.owned ? (
                          <span className="events-card-ownership">Your event</span>
                        ) : (
                          <span className="events-card-ownership events-card-ownership--muted">
                            External event
                          </span>
                        )}
                      </div>
                      {event.owned && (
                        <div className="events-card-actions">
                          <button
                            type="button"
                            className="events-card-actions__btn"
                            onClick={() => handleOrganizerEdit(event)}
                          >
                            Edit Event
                          </button>
                          <button
                            type="button"
                            className="events-card-actions__btn events-card-actions__btn--danger"
                            onClick={() => handleOrganizerDelete(event)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="events-empty">
              <h3>No events found</h3>
              {searchQuery && (
                <p>
                  Nothing matches “<strong>{searchQuery}</strong>”. Try a different term or clear your search.
                </p>
              )}
              <button type="button" className="events-empty__reset" onClick={resetSearch}>
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>

      {config.showCreateButton && (
        <Link to="/events/create" className="events-floating-cta">
          {config.createButtonLabel ?? "Create Event"}
        </Link>
      )}
    </LayoutComponent>
  );
}
