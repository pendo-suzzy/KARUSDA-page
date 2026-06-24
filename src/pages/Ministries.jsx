import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import "./Ministries.css";

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

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
            <a
              href="https://youtube.com/@karatinauniversitysdachurc7370?si=WAdy8bP0FR3V-Y4P"
              target="_blank"
              rel="noopener noreferrer"
              className="choir__yt-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
                <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.386.52A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.112 2.12c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.994 2.994 0 0 0 2.112-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {choir.videos && choir.videos.length > 0 && (
        <>
          <HorizonArc tone="cream" />
          <section className="section choir-videos" id="choir-videos">
            <div className="container">
              <p className="eyebrow">Our Music Ministry</p>
              <h2 className="section__title">Featured Video Performances</h2>
              <p className="section__intro" style={{ color: "var(--ink-soft)" }}>
                Watch and listen to the KARUSDA Grand Choir leading worship and singing praises.
              </p>
              <div className="choir-videos__grid">
                {choir.videos.map((v) => {
                  const vid = getYouTubeId(v.youtubeUrl);
                  return (
                    <a
                      key={v.id}
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="choir-video-card"
                    >
                      <div className="choir-video-card__thumb-wrap">
                        {vid ? (
                          <img
                            src={`https://img.youtube.com/vi/${vid}/0.jpg`}
                            alt={v.title}
                            className="choir-video-card__thumb"
                          />
                        ) : (
                          <div className="choir-video-card__thumb-placeholder">YouTube Video</div>
                        )}
                        <div className="choir-video-card__play-btn">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="choir-video-card__info">
                        <h3 className="choir-video-card__title">{v.title}</h3>
                        {v.date && <span className="choir-video-card__date">{v.date}</span>}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
