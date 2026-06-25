import { useApp } from "../context/AppContext";
import "./Ministries.css";

const fellowshipGroups = [
  {
    title: "Youth and Young Adults",
    time: "Tuesdays · 5:30 PM",
    description: "A space for discipleship, prayer, and creative outreach on campus.",
  },
  {
    title: "Women’s Fellowship",
    time: "Thursdays · 5:30 PM",
    description: "Encouraging one another through Bible study, service, and hospitality.",
  },
];

export default function Ministries() {
  const { data } = useApp();
  const { ministries = [], choir = {}, sermons = [] } = data;

  return (
    <div className="ministries-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Serving in Christ</p>
          <h1 className="page-hero__title">Ministries and fellowship</h1>
          <p className="page-hero__sub">
            KARUSDA is shaped by ministries that nurture faith, build community, and extend the gospel to campus and beyond.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Our ministry families</h2>
          <div className="ministry-grid">
            {ministries.map((ministry, index) => (
              <article key={ministry.id} className="ministry-card">
                <div className="ministry-card__index">0{index + 1}</div>
                <h3 className="ministry-card__name">{ministry.name}</h3>
                <p className="ministry-card__tagline">{ministry.tagline}</p>
                <p className="ministry-card__desc">{ministry.description}</p>
                <p className="ministry-card__time">{ministry.meetingDay} · {ministry.meetingTime}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Campus fellowship groups</h2>
          <div className="fellowship-grid">
            {fellowshipGroups.map((group) => (
              <article key={group.title} className="fellowship-card">
                <h3>{group.title}</h3>
                <p className="fellowship-card__time">{group.time}</p>
                <p>{group.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section choir">
        <div className="container">
          <div className="choir__row">
            <div>
              <p className="eyebrow">Choir and worship</p>
              <h2 className="section__title" style={{ color: "var(--paper)" }}>{choir.name}</h2>
              <p className="choir__desc">{choir.description}</p>
              <div className="choir__times">
                {choir.practiceTimes?.map((slot) => (
                  <span key={`${slot.day}-${slot.time}`} className="choir__time">{slot.day} · {slot.time}</span>
                ))}
              </div>
            </div>
            <div className="choir__stat">
              <span className="choir__stat-value">{choir.members}</span>
              <span className="choir__stat-label">Members</span>
            </div>
          </div>
          <a className="choir__yt-link" href={choir.videos?.[0]?.youtubeUrl} target="_blank" rel="noreferrer">
            ▶ Watch a recent choir recording
          </a>
        </div>
      </section>

      <section className="section choir-videos">
        <div className="container">
          <h2 className="section__title">Recent recordings</h2>
          <div className="choir-videos__grid">
            {choir.videos?.map((video) => (
              <article key={video.id} className="choir-video-card">
                <div className="choir-video-card__thumb-wrap">
                  <div className="choir-video-card__thumb-placeholder">Video preview</div>
                  <div className="choir-video-card__play-btn">▶</div>
                </div>
                <div className="choir-video-card__info">
                  <h3 className="choir-video-card__title">{video.title}</h3>
                  <span className="choir-video-card__date">{video.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Latest sermons</h2>
          <div className="event-list">
            {sermons.slice(0, 2).map((sermon) => (
              <article key={sermon.id} className="event-card">
                <div className="event-card__when">
                  <span className="event-card__date">{sermon.date}</span>
                  <span className="event-card__time">{sermon.scripture}</span>
                </div>
                <div className="event-card__body">
                  <h3>{sermon.title}</h3>
                  <p>{sermon.description}</p>
                  <div className="event-card__location">{sermon.speaker}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
