import { useApp } from "../context/AppContext";
import { normalizeUrl, getThumbnail } from "../lib/urlHelpers";
import "./Events.css";

export default function Events() {
  const { data } = useApp();
  const { events = {}, gallery = [] } = data;
  const { services = [], gatherings = [], volunteer = [] } = events;
  const fridayVespers = gatherings.find((item) => item.isSabbathEve) || gatherings[0];

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
                <div className="event-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="event-card__location">{service.location}</div>
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
                <div className="event-card__body">
                  <h3>{gathering.title}</h3>
                  <p>{gathering.description}</p>
                  <div className="event-card__location">{gathering.location}</div>
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery">
        <div className="container">
          <h2 className="section__title" style={{ color: "var(--paper)" }}>Gallery</h2>
          <div className="gallery__links-list">
            {gallery.map((image) => {
              const rawUrl = image.src || image.url || image.photoUrl;
              const displayUrl = normalizeUrl(rawUrl);
              const thumb = getThumbnail(rawUrl);
              return (
                <a
                  key={image.id}
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-link-card"
                >
                  {thumb && (
                    <img
                      className="wa-link-card__thumb"
                      src={thumb}
                      alt={image.caption}
                    />
                  )}
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
