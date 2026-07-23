import { useState } from "react";
import { useApp } from "../context/AppContext";
import { normalizeUrl, getThumbnail } from "../lib/urlHelpers";
import "./Events.css";

export default function Events() {
  const { data } = useApp();
  const { events = {}, gallery = [] } = data;
  const { services = [], gatherings = [], volunteer = [] } = events;
  const fridayVespers = gatherings.find((item) => item.isSabbathEve) || gatherings[0];
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Weekly services</h2>
          <div className="event-list">
            {services.map((service) => (
              <article key={service.id} className="event-card event-card--gold">
                <div className="event-card__when">
                  <span className="event-card__date">{service.date}</span>
                  <span className="event-card__time">{service.time}</span>
                </div>
                {service.imageUrl && (
                  <div className="event-card__image-wrap">
                    <img src={service.imageUrl} alt={service.title} className="event-card__image" />
                  </div>
                )}
                <div className="event-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="event-card__location">{service.location}</div>
                  {service.documentUrl && (
                    <a href={service.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                      📄 Read Document
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Midweek and fellowship</h2>
          <div className="event-list">
            {gatherings.map((gathering) => (
              <article key={gathering.id} className="event-card">
                <div className="event-card__when">
                  <span className="event-card__date">{gathering.date}</span>
                  <span className="event-card__time">{gathering.time}</span>
                </div>
                {gathering.imageUrl && (
                  <div className="event-card__image-wrap">
                    <img src={gathering.imageUrl} alt={gathering.title} className="event-card__image" />
                  </div>
                )}
                <div className="event-card__body">
                  <h3>{gathering.title}</h3>
                  <p>{gathering.description}</p>
                  <div className="event-card__location">{gathering.location}</div>
                  {gathering.documentUrl && (
                    <a href={gathering.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                      📄 Read Document
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {fridayVespers && (
            <div className="friday-vespers">
              <p className="eyebrow">Friday night</p>
              <h3 className="friday-vespers__title">{fridayVespers.title}</h3>
              <p className="friday-vespers__time">{fridayVespers.time}</p>
              <p className="friday-vespers__desc">
                Welcome the Sabbath in prayer, song, and quiet reflection before the weekend begins. Our weekly service line continues with Sabbath School, divine service, and fellowship throughout the day.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Volunteer opportunities</h2>
          <div className="event-list">
            {volunteer.map((item) => (
              <article key={item.id} className="event-card event-card--highland">
                <div className="event-card__when">
                  <span className="event-card__date">{item.date}</span>
                  <span className="event-card__time">{item.time}</span>
                </div>
                <div className="event-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="event-card__location">{item.location}</div>
                  {item.documentUrl && (
                    <a href={item.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                      📄 Read Document
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
