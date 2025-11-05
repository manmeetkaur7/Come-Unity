// src/pages/Events/EventCard.jsx
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./events.css";

export default function EventCard({
  event,
  showFavorite = false,
  onToggleFavorite,
}) {
  const {
    title,
    category,
    imageUrl,
    description,
    slotsAvailable = 0,
    slotsTotal = 0,
    isSaved = false,
  } = event;

  const availableText = `${slotsAvailable}/${slotsTotal}`;
  const categoryLabel = category ?? "General";
  const categorySlug = categoryLabel.toLowerCase().replace(/\s+/g, "-");
  const [saved, setSaved] = useState(Boolean(isSaved));

  useEffect(() => {
    setSaved(Boolean(isSaved));
  }, [isSaved]);

  const handleToggleFavorite = () => {
    const nextValue = !saved;
    setSaved(nextValue);
    if (onToggleFavorite) {
      onToggleFavorite(event.id, nextValue);
    }
  };

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
            className={`event-favorite ${
              saved ? "event-favorite--active" : ""
            }`}
            onClick={handleToggleFavorite}
            aria-label={
              saved ? `Remove ${title} from saved events` : `Save ${title}`
            }
            aria-pressed={saved}
            title={saved ? "Saved to your events" : "Save this event"}
          >
            {saved ? <FaHeart /> : <FaRegHeart />}
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
