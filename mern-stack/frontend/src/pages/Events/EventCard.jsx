// src/pages/Events/EventCard.jsx
import React from "react";
import "./events.css";

export default function EventCard({ event, showFavorite = false }) {
  const {
    title,
    category,
    imageUrl,
    description,
    slotsAvailable = 0,
    slotsTotal = 0,
  } = event;

  const availableText = `${slotsAvailable}/${slotsTotal}`;
  const categoryLabel = category ?? "General";
  const categorySlug = categoryLabel.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="event-card">
      <div className="event-card__media" data-category={categorySlug}>
        {imageUrl ? (
          <img className="event-image" src={imageUrl} alt={title} />
        ) : (
          <div
            className="event-image event-image--placeholder"
            aria-hidden="true"
          />
        )}
        <span className={`category-tag category-tag--${categorySlug}`}>
          {categoryLabel}
        </span>
        {showFavorite && (
          <button
            type="button"
            className="event-favorite"
            aria-label={`Save ${title}`}
          >
            ♥
          </button>
        )}
      </div>

      <div className="event-card__body">
        <h3 className="event-title">{title}</h3>
        <span className="event-details-label">Details:</span>
        <p className="event-description">{description}</p>
      </div>

      <div className="event-card__footer">
        <div className="slots">
          <span className="slots-label">Slots Available</span>
          <span className="slots-numbers">{availableText}</span>
        </div>
        <button type="button" className="more-details">
          More Details
        </button>
      </div>
    </article>
  );
}
