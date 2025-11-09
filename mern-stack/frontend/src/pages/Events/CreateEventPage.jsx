import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import OrganizerLayout from "./layouts/OrganizerLayout";
import EventCard from "./EventCard";
import logoClear from "@/assets/Logo (clear).png";
import profileBadge from "@/assets/6 1.png";
import calendarIcon from "@/assets/Calender image.png";
import addEventIcon from "@/assets/add-event.png";
import dashboardIcon from "@/assets/dashboard.png";
import "./create-event.css";

const organizerNavLinks = [
  {
    label: "Events",
    href: "/events",
    icon: calendarIcon,
    iconAlt: "Events list",
  },
  {
    label: "Create Event",
    href: "/events/create",
    active: true,
    icon: addEventIcon,
    iconAlt: "Create event",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: dashboardIcon,
    iconAlt: "Organizer dashboard",
  },
];

const categoryOptions = ["Health", "Education", "Cultural", "Family", "Volunteer"];

const hourOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);
const minuteOptions = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0")
);

const toMinutes = (hour, minute, period) => {
  if (!hour || !minute || !period) {
    return null;
  }
  let normalizedHour = Number(hour);
  if (period === "PM" && normalizedHour !== 12) {
    normalizedHour += 12;
  }
  if (period === "AM" && normalizedHour === 12) {
    normalizedHour = 0;
  }
  return normalizedHour * 60 + Number(minute);
};
const now = new Date();
const currentYear = now.getFullYear();
const defaultCalendarView = {
  year: currentYear,
  month: now.getMonth(),
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const yearOptions = Array.from({ length: 5 }, (_, index) => String(currentYear + index));
const yearNumberOptions = yearOptions.map((year) => Number(year));
const minYearOption = yearNumberOptions[0];
const maxYearOption = yearNumberOptions[yearNumberOptions.length - 1];

const parseDateString = (value) => {
  if (!value) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 0 ||
    month > 11 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return { year, month, day };
};

const defaultFormState = {
  name: "",
  description: "",
  eventDate: "",
  eventYear: String(currentYear),
  startHour: "",
  startMinute: "",
  startPeriod: "",
  endHour: "",
  endMinute: "",
  endPeriod: "",
  address: "",
  volunteersNeeded: "",
  category: categoryOptions[0],
  imageFile: null,
};

export default function CreateEventPage({ user, onSubmit }) {
  const [formData, setFormData] = useState(defaultFormState);
  const [imagePreview, setImagePreview] = useState("");
  const [submissionState, setSubmissionState] = useState({
    status: "idle",
    message: "",
  });
  const [calendarView, setCalendarView] = useState(() => ({
    ...defaultCalendarView,
  }));

  const isOrganizer = user?.role === "organizer";

  const navLinks = useMemo(
    () =>
      organizerNavLinks.map((link) =>
        link.label === "Create Event"
          ? { ...link, active: true }
          : { ...link, active: false }
      ),
    []
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const nextYear = Number(formData.eventYear);
    if (Number.isNaN(nextYear)) {
      return;
    }
    setCalendarView((current) =>
      current.year === nextYear ? current : { ...current, year: nextYear }
    );
  }, [formData.eventYear]);

  useEffect(() => {
    const parts = parseDateString(formData.eventDate);
    if (!parts) {
      return;
    }
    setCalendarView((current) =>
      current.year === parts.year && current.month === parts.month
        ? current
        : { year: parts.year, month: parts.month }
    );
  }, [formData.eventDate]);

  const previewEvent = useMemo(() => {
    const volunteers = Number(formData.volunteersNeeded) || 0;
    const startTime =
      formData.startHour && formData.startMinute && formData.startPeriod
        ? `${formData.startHour}:${formData.startMinute} ${formData.startPeriod}`
        : "";
    const endTime =
      formData.endHour && formData.endMinute && formData.endPeriod
        ? `${formData.endHour}:${formData.endMinute} ${formData.endPeriod}`
        : "";
    return {
      id: "preview",
      title: formData.name || "Event name goes here",
      category: formData.category || "General",
      description:
        formData.description ||
        "Your description will give neighbors and volunteers a feel for the experience.",
      imageUrl: imagePreview || "",
      slotsAvailable: volunteers,
      slotsTotal: volunteers || 100,
      startTime,
      endTime,
    };
  }, [
    formData.category,
    formData.description,
    formData.name,
    formData.volunteersNeeded,
    formData.startHour,
    formData.startMinute,
    formData.startPeriod,
    formData.endHour,
    formData.endMinute,
    formData.endPeriod,
    imagePreview,
  ]);

  if (!isOrganizer) {
    return <Navigate to="/events" replace />;
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setSubmissionState({ status: "idle", message: "" });
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setSubmissionState({ status: "idle", message: "" });

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImagePreview("");
      setFormData((current) => ({ ...current, imageFile: null }));
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setImagePreview(nextPreview);
    setFormData((current) => ({ ...current, imageFile: file }));
  };

  const resetForm = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setFormData({ ...defaultFormState });
    setSubmissionState({ status: "idle", message: "" });
    setCalendarView({ ...defaultCalendarView });
  };

  const handleYearChange = (event) => {
    const nextYear = event.target.value;
    setSubmissionState({ status: "idle", message: "" });

    setFormData((current) => {
      if (!current.eventDate) {
        return {
          ...current,
          eventYear: nextYear,
        };
      }

      const [, month = "01", day = "01"] = current.eventDate.split("-");
      const candidate = `${nextYear}-${month}-${day}`;
      const parsedCandidate = new Date(candidate);
      const isValid =
        !Number.isNaN(parsedCandidate.getTime()) &&
        parsedCandidate.getFullYear().toString() === nextYear &&
        parsedCandidate.getMonth() + 1 === Number(month);

      return {
        ...current,
        eventYear: nextYear,
        eventDate: isValid ? candidate : "",
      };
    });
  };

  const navigateMonth = (step) => {
    setCalendarView((current) => {
      let year = current.year;
      let month = current.month + step;

      if (month < 0) {
        if (year <= minYearOption) {
          return current;
        }
        month = 11;
        year -= 1;
      } else if (month > 11) {
        if (year >= maxYearOption) {
          return current;
        }
        month = 0;
        year += 1;
      }

      if (year !== current.year) {
        setFormData((prev) => ({
          ...prev,
          eventYear: year.toString(),
        }));
      }

      return { year, month };
    });
  };

  const handlePrevMonth = () => navigateMonth(-1);
  const handleNextMonth = () => navigateMonth(1);

  const handleSelectDate = (day) => {
    const selectedDate = new Date(calendarView.year, calendarView.month, day);
    if (Number.isNaN(selectedDate.getTime())) {
      return;
    }
    const isoDate = selectedDate.toISOString().split("T")[0];
    setSubmissionState({ status: "idle", message: "" });
    setFormData((current) => ({
      ...current,
      eventDate: isoDate,
      eventYear: selectedDate.getFullYear().toString(),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedAddress = formData.address.trim();

    if (!trimmedName || !trimmedDescription) {
      setSubmissionState({
        status: "error",
        message: "Please add both a name and description for your event.",
      });
      return;
    }

    if (!formData.eventDate) {
      setSubmissionState({
        status: "error",
        message: "Pick a date for your event before publishing.",
      });
      return;
    }

  if (
    !formData.startHour ||
    !formData.startMinute ||
    !formData.startPeriod ||
    !formData.endHour ||
    !formData.endMinute ||
    !formData.endPeriod
  ) {
    setSubmissionState({
      status: "error",
      message: "Choose both start and end times.",
    });
    return;
  }

  const startMinutes = toMinutes(
    formData.startHour,
    formData.startMinute,
    formData.startPeriod
  );
  const endMinutes = toMinutes(
    formData.endHour,
    formData.endMinute,
    formData.endPeriod
  );

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    setSubmissionState({
      status: "error",
      message: "End time must be after the start time.",
    });
    return;
  }

    const payload = {
      ...formData,
      name: trimmedName,
      description: trimmedDescription,
      address: trimmedAddress,
    };

    if (typeof onSubmit === "function") {
      onSubmit(payload);
    } else {
      // Local fallback until backend wiring is ready
      console.info("[CreateEventPage] Event submission:", payload);
    }

    setSubmissionState({
      status: "success",
      message: "Great work! Your event is queued for publishing.",
    });
  };

  const isSuccess = submissionState.status === "success";
  const isError = submissionState.status === "error";
  const canGoPrevMonth =
    calendarView.year > minYearOption || (calendarView.year === minYearOption && calendarView.month > 0);
  const canGoNextMonth =
    calendarView.year < maxYearOption || (calendarView.year === maxYearOption && calendarView.month < 11);
  const firstDayOffset = new Date(calendarView.year, calendarView.month, 1).getDay();
  const daysInMonth = new Date(calendarView.year, calendarView.month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  const calendarCells = Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstDayOffset + 1;
    return dayNumber >= 1 && dayNumber <= daysInMonth ? dayNumber : null;
  });
  const selectedDateParts = parseDateString(formData.eventDate);
  const today = new Date();
  const previewDate =
    selectedDateParts &&
    new Date(selectedDateParts.year, selectedDateParts.month, selectedDateParts.day);

  return (
    <OrganizerLayout
      navLinks={navLinks}
      roleLabel="Organizer"
      logoSrc={logoClear}
      profileIcon={profileBadge}
    >
      <div className="create-event-page">
        <section className="create-event-card">
          <header className="create-event-card__header">
            <div>
              <h1>Create a Community Event</h1>
              <p>
                Share the essentials for your gathering. You can always come back to adjust your
                event after publishing.
              </p>
            </div>
            {isSuccess && (
              <span className="create-event-status create-event-status--success">
                {submissionState.message}
              </span>
            )}
            {isError && (
              <span className="create-event-status create-event-status--error">
                {submissionState.message}
              </span>
            )}
          </header>

          <form className="create-event-form" onSubmit={handleSubmit}>
            <div className="create-event-section">
              <label>
                Event name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFieldChange}
                  placeholder="Community Garden Kickoff"
                  required
                />
              </label>
              <label className="create-event-textarea">
                Description
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleFieldChange}
                  placeholder="Share what volunteers and neighbors can expect from this event."
                  required
                />
              </label>
            </div>

            <div className="create-event-section">
              <div className="create-event-datetime">
                <fieldset className="create-event-calendar-fieldset">
                  <legend>Day &amp; month</legend>
                  <div className="create-event-calendar">
                    <div className="create-event-calendar__header">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={!canGoPrevMonth}
                        aria-label="Previous month"
                      >
                        &lt;
                      </button>
                      <span>{monthNames[calendarView.month]}</span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={!canGoNextMonth}
                        aria-label="Next month"
                      >
                        &gt;
                      </button>
                    </div>
                    <div className="create-event-calendar__weekdays">
                      {weekdayLabels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                    <div className="create-event-calendar__grid">
                      {calendarCells.map((dayNumber, index) => {
                        if (!dayNumber) {
                          return (
                            <span
                              key={`empty-${index}`}
                              className="create-event-calendar__day create-event-calendar__day--empty"
                              aria-hidden="true"
                            />
                          );
                        }

                        const isSelected =
                          selectedDateParts &&
                          selectedDateParts.year === calendarView.year &&
                          selectedDateParts.month === calendarView.month &&
                          selectedDateParts.day === dayNumber;

                        const isToday =
                          today.getFullYear() === calendarView.year &&
                          today.getMonth() === calendarView.month &&
                          today.getDate() === dayNumber;

                        const dayClasses = [
                          "create-event-calendar__day",
                          isSelected ? "create-event-calendar__day--selected" : "",
                          isToday ? "create-event-calendar__day--today" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <button
                            type="button"
                            key={`day-${dayNumber}-${index}`}
                            className={dayClasses}
                            onClick={() => handleSelectDate(dayNumber)}
                            aria-pressed={isSelected}
                          >
                            {dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </fieldset>
                <label>
                  Year
                  <select
                    name="eventYear"
                    value={formData.eventYear}
                    onChange={handleYearChange}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="create-event-time">
                <label>
                  Start hour
                  <select
                    name="startHour"
                    value={formData.startHour}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Start minutes
                  <select
                    name="startMinute"
                    value={formData.startMinute}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  AM / PM
                  <select
                    name="startPeriod"
                    value={formData.startPeriod}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              </div>

              <div className="create-event-time">
                <label>
                  End hour
                  <select
                    name="endHour"
                    value={formData.endHour}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    {hourOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  End minutes
                  <select
                    name="endMinute"
                    value={formData.endMinute}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  AM / PM
                  <select
                    name="endPeriod"
                    value={formData.endPeriod}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="create-event-section">
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFieldChange}
                  placeholder="3415 Martin Luther King Jr Blvd, Sacramento, CA"
                />
              </label>
              <div className="create-event-section--grid">
                <label>
                  Volunteers needed
                  <input
                    type="number"
                    name="volunteersNeeded"
                    value={formData.volunteersNeeded}
                    onChange={handleFieldChange}
                    min={0}
                    placeholder="e.g. 25"
                  />
                </label>
                <label>
                  Category
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFieldChange}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="create-event-upload">
                Feature image
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span>Recommended 1200 x 800 px. JPG or PNG works best.</span>
              </label>
            </div>

            <footer className="create-event-actions">
              <button
                type="button"
                className="create-event-actions__secondary"
                onClick={resetForm}
              >
                Clear form
              </button>
              <button type="submit" className="create-event-actions__publish">
                Publish event
              </button>
            </footer>
          </form>
        </section>

        <aside className="create-event-preview">
          <div className="create-event-preview__header">
            <h2>Event Card Preview</h2>
            <p>This is how your event will appear inside the community listings.</p>
            <div className="create-event-preview__meta">
              <span>
                {previewDate
                  ? previewDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick a date"}
              </span>
              {previewEvent.startTime && previewEvent.endTime && (
                <span>
                  {previewEvent.startTime} – {previewEvent.endTime}
                </span>
              )}
            </div>
          </div>

          <div className="create-event-preview__body">
            <EventCard event={previewEvent} showFavorite={false} />
          </div>
        </aside>
      </div>
    </OrganizerLayout>
  );
}
