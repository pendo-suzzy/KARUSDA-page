import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import "./Ministries.css";

export default function Ministries() {
  const { data } = useApp();
  const { ministries, choir, events } = data;
  const wedVespers = events.gatherings.find((g) => g.title.includes("Wednesday"));
  const amoAlo = events.gatherings.find((g) => g.title.includes("AMO"));
  const friVespers = events.gatherings.find((g) => g.isSabbathEve);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Ministries</p>
          <h1 className="page-hero__title">Three ministries, one calling</h1>
          <p className="page-hero__sub">
            Named after the voices that shaped Adventist history — each one
            meets every Monday at 5:30 PM.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container ministry-grid">
          {ministries.map((m, i) => (
            <article className="ministry-card" key={m.id}>
              <span className="ministry-card__index">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="ministry-card__name">{m.name}</h2>
              <p className="ministry-card__tagline">{m.tagline}</p>
              <p className="ministry-card__desc">{m.description}</p>
              <p className="ministry-card__time">
                {m.meetingDay}s · {m.meetingTime}
              </p>
            </article>
          ))}
        </div>
      </section>

      <HorizonArc tone="cream" />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Through the week</p>
          <h2 className="section__title">Fellowship gatherings</h2>
          <div className="fellowship-grid">
            {amoAlo && (
              <div className="fellowship-card">
                <h3>{amoAlo.title}</h3>
                <p className="fellowship-card__time">{amoAlo.date} · {amoAlo.time}</p>
                <p>{amoAlo.description}</p>
              </div>
            )}
            {wedVespers && (
              <div className="fellowship-card">
                <h3>{wedVespers.title}</h3>
                <p className="fellowship-card__time">{wedVespers.date} · {wedVespers.time}</p>
                <p>{wedVespers.description}</p>
              </div>
            )}
          </div>

          {friVespers && (
            <div className="friday-vespers" style={{ marginTop: "1.5rem" }}>
              <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>A separate moment, every week</p>
              <h3 className="friday-vespers__title">{friVespers.title}</h3>
              <p className="friday-vespers__time">{friVespers.date} · {friVespers.time}</p>
              <p className="friday-vespers__desc">{friVespers.description}</p>
            </div>
          )}
        </div>
      </section>

      <HorizonArc tone="dark" />

      <section className="section choir">
        <div className="container choir__row">
          <div>
            <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Worship in song</p>
            <h2 className="section__title" style={{ color: "var(--paper)" }}>{choir.name}</h2>
            <p className="choir__desc">{choir.description}</p>
            <div className="choir__times">
              {choir.practiceTimes.map((t) => (
                <span key={t.day} className="choir__time">{t.day} · {t.time}</span>
              ))}
            </div>
          </div>
          <div className="choir__stat">
            <span className="choir__stat-value">{choir.members}+</span>
            <span className="choir__stat-label">Vocalists</span>
          </div>
        </div>
      </section>
    </>
  );
}
