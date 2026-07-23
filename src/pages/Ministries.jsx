import { useApp } from "../context/AppContext";
import { getYoutubeThumbnail, normalizeUrl } from "../lib/urlHelpers";
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

      <section id="ministries" className="section">
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
                {ministry.documentUrl && (
                  <a href={ministry.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                    📄 Read Document
                  </a>
                )}
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
                {group.documentUrl && (
                  <a href={group.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                    📄 Read Document
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="choir" className="section choir">
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
          <a className="choir__yt-link" href="https://www.youtube.com/channel/UCmFWvxiBFvwYkJbsQ8zdMXg" target="_blank" rel="noreferrer">
            Youtube Chanel
          </a>
        </div>
      </section>

      <section className="section choir-videos">
        <div className="container">
          <h2 className="section__title">Recent recordings</h2>
          <div className="choir-videos__grid">
            {choir.videos?.map((video) => {
              const rawUrl = video.youtubeUrl || video.youtube_url || video.url || video.src;
              const videoLink = normalizeUrl(rawUrl);
              const thumb = getYoutubeThumbnail(rawUrl);
              const cardContent = (
                <>
                  <div className="choir-video-card__thumb-wrap">
                    {thumb ? (
                      <img
                        className="choir-video-card__thumb"
                        src={thumb}
                        alt={video.title}
                      />
                    ) : (
                      <div className="choir-video-card__thumb-placeholder">Video preview</div>
                    )}
                    <div className="choir-video-card__play-btn">▶</div>
                  </div>
                  <div className="choir-video-card__info">
                    <h3 className="choir-video-card__title">{video.title}</h3>
                    <span className="choir-video-card__date">{video.date}</span>
                  </div>
                </>
              );

              return videoLink ? (
                <a
                  key={video.id}
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="choir-video-card"
                >
                  {cardContent}
                </a>
              ) : (
                <article key={video.id} className="choir-video-card">
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="sermons" className="section">
        <div className="container">
          <h2 className="section__title">Latest sermons</h2>
          <div className="sermon-grid">
            {sermons.slice(0, 2).map((sermon) => {
              const rawSermonUrl = sermon.youtubeUrl || sermon.youtube_url || sermon.url || sermon.src;
              const sermonLink = normalizeUrl(rawSermonUrl);
              const sermonThumbnail = getYoutubeThumbnail(rawSermonUrl);
              const cardContent = (
                <>
                  <div className="sermon-card__thumb-wrap">
                    {sermonThumbnail ? (
                      <img className="sermon-card__thumb" src={sermonThumbnail} alt={sermon.title} />
                    ) : (
                      <div className="sermon-card__thumb-placeholder">Video preview</div>
                    )}
                  </div>
                  <div className="sermon-card__body">
                    <div className="sermon-card__meta">
                      <span className="sermon-card__date">{sermon.date}</span>
                      {sermon.scripture ? <span className="sermon-card__scripture">{sermon.scripture}</span> : null}
                    </div>
                    <h3 className="sermon-card__title">
                      {sermon.title} {sermonLink && <span className="sermon-card__play">▶</span>}
                    </h3>
                    <p className="sermon-card__desc">{sermon.description}</p>
                    {sermon.speaker ? <div className="sermon-card__speaker">{sermon.speaker}</div> : null}
                  </div>
                </>
              );

              return sermonLink ? (
                <a
                  key={sermon.id}
                  href={sermonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sermon-card"
                >
                  {cardContent}
                </a>
              ) : (
                <article key={sermon.id} className="sermon-card">
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
