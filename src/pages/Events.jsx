import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import "./Events.css";

export default function Events() {
  const { data } = useApp();
  const { services, gatherings, volunteer } = data.events;
  const fridayVespers = gatherings.find((g) => g.isSabbathEve);
  const otherGatherings = gatherings.filter((g) => !g.isSabbathEve);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Events</p>
          <h1 className="page-hero__title">What's happening at KARUSDA</h1>
          <p className="page-hero__sub">
            Services, fellowship, and ways to serve — all in one place.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Worship</p>
          <h2 className="section__title">Sabbath services</h2>
          <div className="event-list">
            {services.map((e) => (
              <EventCard key={e.id} event={e} accent="gold" />
            ))}
          </div>
        </div>
      </section>

      <HorizonArc tone="cream" />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Community</p>
          <h2 className="section__title">Gatherings</h2>
          <div className="event-list">
            {otherGatherings.map((e) => (
              <EventCard key={e.id} event={e} accent="ink" />
            ))}
          </div>

          {fridayVespers && (
            <div className="friday-vespers">
              <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>As the sun goes down</p>
              <h3 className="friday-vespers__title">{fridayVespers.title}</h3>
              <p className="friday-vespers__time">{fridayVespers.date} · {fridayVespers.time}</p>
              <p className="friday-vespers__desc">{fridayVespers.description}</p>
            </div>
          )}
        </div>
      </section>

      <HorizonArc tone="cream" />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Serve</p>
          <h2 className="section__title">Volunteer opportunities</h2>
          <div className="event-list">
            {volunteer.map((e) => (
              <EventCard key={e.id} event={e} accent="highland" />
            ))}
          </div>
        </div>
      </section>

      <HorizonArc tone="dark" />

      <section className="section gallery">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Gallery</p>
          <h2 className="section__title" style={{ color: "var(--paper)" }}>
            Recent missions &amp; fellowship
          </h2>
          <div className="gallery__grid">
            {data.gallery.map((g) => (
              <figure className="gallery__item" key={g.id}>
                <img src={g.src} alt={g.caption} loading="lazy" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function EventCard({ event, accent }) {
  return (
    <article className={`event-card event-card--${accent}`}>
      <div className="event-card__when">
        <span className="event-card__date">{event.date}</span>
        <span className="event-card__time">{event.time}</span>
      </div>
      <div className="event-card__body">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <span className="event-card__location">{event.location}</span>
      </div>
    </article>
  );
}
