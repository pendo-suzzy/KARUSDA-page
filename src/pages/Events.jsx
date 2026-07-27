import { useState } from "react";
import { useApp } from "../context/AppContext";
import { normalizeUrl, getThumbnail } from "../lib/urlHelpers";
import "./Events.css";

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return { date: "", time: "" };
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return { date: dateTimeStr, time: "" };
    return {
      date: d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  } catch {
    return { date: dateTimeStr, time: "" };
  }
}

function EventCard({ item, accentClass = "" }) {
  const { date, time } = formatDateTime(item.dateTime);
  return (
    <article className={`event-card ${accentClass}`}>
      <div className="event-card__when">
        <span className="event-card__date">{date}</span>
        <span className="event-card__time">{time}</span>
      </div>
      {item.imageUrl && (
        <div className="event-card__image-wrap">
          <img src={item.imageUrl} alt={item.title} className="event-card__image" />
        </div>
      )}
      <div className="event-card__body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {item.location && <div className="event-card__location">📍 {item.location}</div>}
        {item.documentUrl && (
          <a href={item.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
            📄 Read Document
          </a>
        )}
      </div>
    </article>
  );
}

function SectionBanner({ icon, label, color }) {
  return (
    <div className="events-section-banner" style={{ "--banner-color": color }}>
      <span className="events-section-banner__icon">{icon}</span>
      <span className="events-section-banner__label">{label}</span>
    </div>
  );
}

export default function Events() {
  const { data } = useApp();
  const { events = {}, gallery = [] } = data;
  const { services = [], gatherings = [], volunteer = [] } = events;
  const [failedImages, setFailedImages] = useState({});

  return (
    <div className="events-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Gathering rhythm</p>
          <h1 className="page-hero__title">Events at KARUSDA</h1>
          <p className="page-hero__sub">
            Worship, fellowship, and service come together throughout the week at Karatina University SDA Church.
          </p>
          <div className="events-nav">
            <a href="#services" className="events-nav__pill">⛪ Services</a>
            <a href="#gatherings" className="events-nav__pill">🤝 Gatherings</a>
            <a href="#volunteer" className="events-nav__pill">🙌 Volunteer</a>
            <a href="#gallery" className="events-nav__pill">🖼️ Gallery</a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section id="services" className="section events-category-section events-category-section--services">
        <div className="container">
          <SectionBanner icon="⛪" label="Weekly Services" color="var(--gold)" />
          <p className="events-category-desc">Join us every Sabbath for worship, Sabbath School, divine service, and fellowship.</p>
          {services.length === 0 ? (
            <div className="events-empty">
              <span>No services scheduled yet. Check back soon!</span>
            </div>
          ) : (
            <div className="event-list">
              {services.map((service) => (
                <EventCard key={service.id} item={service} accentClass="event-card--gold" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GATHERINGS ────────────────────────────────── */}
      <section id="gatherings" className="section events-category-section events-category-section--gatherings">
        <div className="container">
          <SectionBanner icon="🤝" label="Midweek & Gatherings" color="var(--clay)" />
          <p className="events-category-desc">Midweek prayer, Bible study, and special fellowship meetings throughout the week.</p>
          {gatherings.length === 0 ? (
            <div className="events-empty">
              <span>No gatherings scheduled yet. Check back soon!</span>
            </div>
          ) : (
            <div className="event-list">
              {gatherings.map((gathering) => (
                <EventCard key={gathering.id} item={gathering} accentClass="event-card--clay" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── VOLUNTEER ─────────────────────────────────── */}
      <section id="volunteer" className="section events-category-section events-category-section--volunteer">
        <div className="container">
          <SectionBanner icon="🙌" label="Volunteer Opportunities" color="var(--highland)" />
          <p className="events-category-desc">Serve the campus and community — from outreach to hospitality and beyond.</p>
          {volunteer.length === 0 ? (
            <div className="events-empty">
              <span>No volunteer opportunities listed yet. Check back soon!</span>
            </div>
          ) : (
            <div className="event-list">
              {volunteer.map((item) => (
                <EventCard key={item.id} item={item} accentClass="event-card--highland" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────── */}
      <section id="gallery" className="section gallery">
        <div className="container">
          <div className="gallery__header">
            <h2 className="section__title gallery__title">Gallery</h2>
          </div>
          <div className="gallery__links-list">
            {gallery.map((image) => {
              const rawUrl = image.src || image.url || image.photoUrl;
              const displayUrl = normalizeUrl(rawUrl);
              const thumb = getThumbnail(rawUrl);
              const imageSrc = thumb || displayUrl || rawUrl;
              const clickTarget = rawUrl || displayUrl;
              const hasFailed = Boolean(failedImages[image.id]);
              return (
                <a
                  key={image.id}
                  href={clickTarget}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-link-card"
                >
                  <div className="wa-link-card__thumb-wrap">
                    {imageSrc && !hasFailed ? (
                      <img
                        className="wa-link-card__thumb"
                        src={imageSrc}
                        alt={image.caption}
                        onError={() => setFailedImages((prev) => ({ ...prev, [image.id]: true }))}
                      />
                    ) : (
                      <div className="wa-link-card__thumb-placeholder">
                        <span>{image.caption || "Image preview"}</span>
                      </div>
                    )}
                  </div>
                  <div className="wa-link-card__body">
                    <h4 className="wa-link-card__title">{image.caption}</h4>
                    <p className="wa-link-card__url">
                      {displayUrl || "No valid URL provided"}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
