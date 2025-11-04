// src/pages/Events/EventsPage.jsx
import React from "react";
import EventCard from "./EventCard";
import VolunteerLayout from "./layouts/VolunteerLayout";
import OrganizerLayout from "./layouts/OrganizerLayout";
import AdminLayout from "./layouts/AdminLayout";
import "./events.css";

const roleConfig = {
  volunteer: {
    variant: "volunteer",
    navLinks: [
      { label: "Events", href: "/events", active: true },
      { label: "Saved Events", href: "/events/saved" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    roleLabel: "Volunteer",
    title: "Discover Community Event",
    subtitle: "Find opportunities that match your interests",
    eventsHeading: "Up Coming Events...",
    eventsSubheading: "Find opportunities that match your interests",
    showFavorites: true,
    showCreateButton: false,
  },
  organizer: {
    variant: "organizer",
    navLinks: [
      { label: "Events", href: "/events", active: true },
      { label: "Create Event", href: "/events/create" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    roleLabel: "Organizer",
    title: "Discover Community Event",
    subtitle: "Find opportunities that match your interests",
    eventsHeading: "Up Coming Events...",
    eventsSubheading: "Find opportunities that match your interests",
    showFavorites: false,
    showCreateButton: true,
    createButtonLabel: "Create Event",
  },
  admin: {
    variant: "admin",
    navLinks: [
      { label: "Events", href: "/events", active: true },
      { label: "Dashboard", href: "/dashboard" },
    ],
    roleLabel: "Admin",
    title: "Live Community Events",
    subtitle: "Keeping the Community Safe",
    eventsHeading: "Up Coming Events...",
    eventsSubheading: "Find opportunities that match your interests",
    showFavorites: false,
    showCreateButton: false,
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
    title: "The Self-Care Social | Pop-Up Market",
    category: "Health",
    description:
      "It’s more than a market — it’s a movement bringing together wellness, beauty, and community.",
    slotsAvailable: 3,
    slotsTotal: 45,
  },
  {
    id: 2,
    title: "Wild Things at Central Library",
    category: "Education",
    description:
      "Several animal ambassadors will be present — expect to see live animals that participants can see up close.",
    slotsAvailable: 13,
    slotsTotal: 25,
  },
  {
    id: 3,
    title: "Trick or Treat at Sacramento Children's Museum",
    category: "Family",
    description:
      "Kids can trick-or-treat at the museum on Halloween morning. Gently used or new book donations are requested.",
    slotsAvailable: 9,
    slotsTotal: 40,
  },
  {
    id: 4,
    title: "Food as Medicine Health Conference",
    category: "Health",
    description:
      "A full-day conference on integrating plant-based nutrition into health care and the heart of healing.",
    slotsAvailable: 29,
    slotsTotal: 100,
  },
  {
    id: 5,
    title: "First Responder Mental Health & Wellness Conference",
    category: "Health",
    description:
      "Focused on mental health for first responders, their families, and wellness professionals with tools and support.",
    slotsAvailable: 32,
    slotsTotal: 100,
  },
  {
    id: 6,
    title: "Sacramento Food Bank Volunteer Event",
    category: "Volunteer",
    description:
      "Volunteers help bag fresh produce and sort non-perishable items for distribution throughout the community.",
    slotsAvailable: 20,
    slotsTotal: 25,
  },
  {
    id: 7,
    title: "Voices in Color: A Celebration of Diversity",
    category: "Cultural",
    description:
      "Explore diversity through art, music, and storytelling that celebrates cultures from around the world.",
    slotsAvailable: 17,
    slotsTotal: 65,
  },
  {
    id: 8,
    title: "2025 Education Conference (CALCIMA)",
    category: "Education",
    description:
      "A statewide education conference focusing on learning, leadership, and innovation in K-12.",
    slotsAvailable: 57,
    slotsTotal: 100,
  },
];

export default function EventsPage({ user }) {
  const role = user?.role ?? "volunteer";
  const config = roleConfig[role] ?? roleConfig.volunteer;
  const LayoutComponent = Layouts[role] ?? VolunteerLayout;

  const categories = Array.from(
    new Set(mockEvents.map((event) => event.category).filter(Boolean))
  );

  return (
    <LayoutComponent navLinks={config.navLinks} roleLabel={config.roleLabel}>
      <div className="events-shell">
        <section className={`events-hero events-hero--${config.variant}`}>
          <h1 className="events-hero__title">{config.title}</h1>
          <p className="events-hero__subtitle">{config.subtitle}</p>

          <div className="events-toolbar">
            <div className="events-search">
              <input
                type="search"
                placeholder="Search events"
                aria-label="Search events"
              />
              <button type="button">Search</button>
            </div>

            <div className="events-filter">
              <select aria-label="Select category">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="button">Filter</button>
            </div>
          </div>
        </section>

        <section className="events-section">
          <h2 className="events-section__title">{config.eventsHeading}</h2>
          <p className="events-section__subtitle">
            {config.eventsSubheading}
          </p>

          <div className="events-grid">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showFavorite={config.showFavorites}
              />
            ))}
          </div>
        </section>
      </div>

      {config.showCreateButton && (
        <button type="button" className="events-floating-cta">
          {config.createButtonLabel ?? "Create Event"}
        </button>
      )}
    </LayoutComponent>
  );
}
