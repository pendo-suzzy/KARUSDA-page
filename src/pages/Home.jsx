import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import SabbathHorizon from "../components/SabbathHorizon";
import AnnouncementCard from "../components/AnnouncementCard";
import HeroSlider from "../components/HeroSlider";
import "./Home.css";

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function Home() {
  const { data } = useApp();
  const announcementsRef = useRef(null);
  const [viewingSermon, setViewingSermon] = useState(false);
  const [activeSermon, setActiveSermon] = useState(null);

  const scrollToAnnouncements = () => {
    announcementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWatchSermon = (e) => {
    e.preventDefault();
    if (data.sermons && data.sermons.length > 0) {
      setActiveSermon(data.sermons[0]);
    }
    setViewingSermon(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewingSermon) {
    const currentSermon = activeSermon || (data.sermons && data.sermons[0]);
    const youtubeId = currentSermon ? getYouTubeId(currentSermon.youtubeUrl) : null;
    const otherSermons = (data.sermons || []).filter((s) => s.id !== currentSermon?.id);

    return (
      <div className="sermon-page">
        <header className="page-hero sermon-hero">
          <div className="container">
            <button
              className="btn btn-outline"
              style={{ marginBottom: "1.5rem", color: "var(--ink)", borderColor: "var(--ink)" }}
              onClick={() => setViewingSermon(false)}
            >
              ← Back to Home
            </button>
            <p className="eyebrow">Word of the Week</p>
            <h1 className="page-hero__title" style={{ fontFamily: "var(--font-display)", fontWeight: "600" }}>
              {currentSermon ? currentSermon.title : "No Sermons Available"}
            </h1>
            {currentSermon && (
              <p className="sermon-speaker" style={{ color: "var(--ink-soft)", fontWeight: "500", marginTop: "0.5rem" }}>
                Preached by <strong>{currentSermon.speaker}</strong> · Scripture: <em>{currentSermon.scripture || "N/A"}</em>
              </p>
            )}
          </div>
        </header>

        <section className="section sermon-player-section">
          <div className="container sermon-layout">
            <div className="sermon-player-container">
              {youtubeId ? (
                <div className="video-responsive">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                    title={currentSermon?.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="sermon-player-placeholder">
                  <p>No video link available for this sermon.</p>
                </div>
              )}

              {currentSermon && (
                <div className="sermon-details">
                  <span className="sermon-date" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--clay)" }}>
                    {currentSermon.date}
                  </span>
                  <h2 className="sermon-details__title">{currentSermon.title}</h2>
                  <p className="sermon-details__desc">{currentSermon.description}</p>
                </div>
              )}
            </div>

            <div className="sermon-sidebar">
              <h3 className="sermon-sidebar__title">More Sermons</h3>
              {otherSermons.length > 0 ? (
                <div className="sermon-sidebar__list">
                  {otherSermons.map((s) => {
                    const sid = getYouTubeId(s.youtubeUrl);
                    return (
                      <div
                        key={s.id}
                        className="sermon-sidebar__card"
                        onClick={() => {
                          setActiveSermon(s);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {sid ? (
                          <img
                            src={`https://img.youtube.com/vi/${sid}/0.jpg`}
                            alt={s.title}
                            className="sermon-sidebar__thumb"
                          />
                        ) : (
                          <div className="sermon-sidebar__thumb-placeholder">Video</div>
                        )}
                        <div className="sermon-sidebar__info">
                          <h4>{s.title}</h4>
                          <span>{s.speaker}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-sermons-text">No other recent sermons.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <HeroSlider>
        <div className="container hero__content">
          <p className="eyebrow hero__eyebrow" style={{ color: "var(--gold-soft)" }}>
            Karatina University SDA Church
          </p>
          <h1 className="hero__title">
            Rest is sacred here.
            <br /> So is the work that follows.
          </h1>
          <p className="hero__subtitle">
            KARUSDA has gathered students and the Karatina community for over a
            decade — for Sabbath worship, for fellowship, and for mission
            beyond these walls.
          </p>

          <div className="hero__actions">
            <button onClick={handleWatchSermon} className="btn btn-solid">
              Watch Sermon
            </button>
            <button className="btn btn-outline" onClick={scrollToAnnouncements}>
              Announcements
            </button>
          </div>
        </div>
      </HeroSlider>

      <HorizonArc tone="cream" />

      {/* STATS */}
      <section className="section stats">
        <div className="container stats__grid">
          <Stat value={`${data.stats.yearsActive}+`} label="Years as a congregation" />
          <Stat value={`${data.stats.members}+`} label="Active members" />
          <Stat value={data.stats.ministries} label="Active ministries" />
          <Stat value={`${data.stats.choirVoices}+`} label="Voices in the choir" />
        </div>
      </section>

      {/* SABBATH HORIZON */}
      <section className="section">
        <div className="container">
          <SabbathHorizon />
        </div>
      </section>

      <HorizonArc tone="cream" />

      {/* ANNOUNCEMENTS */}
      <section className="section announcements" ref={announcementsRef} id="announcements">
        <div className="container">
          <p className="eyebrow">For the family</p>
          <h2 className="section__title">Announcements</h2>
          <p className="section__intro">
            Anyone can read these — tap the heart if something speaks to you.
          </p>
          <div className="announcements__grid">
            {data.announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      </section>

      <HorizonArc tone="cream" />

      {/* LEADERS */}
      <section className="section leaders" id="leaders">
        <div className="container">
          <p className="eyebrow">Our Leaders</p>
          <h2 className="section__title">Church Leadership</h2>
          <p className="section__intro">
            Meet the leaders dedicating their time and stewardship to guide the KARUSDA community.
          </p>
          <div className="leaders__grid">
            {(data.leadership || []).map((leader) => (
              <div key={leader.id} className="leader-card">
                <div className="leader-card__image-wrap">
                  <img
                    src={leader.photo || `https://picsum.photos/seed/${leader.name}/300/300`}
                    alt={leader.photoDesc || leader.name}
                    className="leader-card__image"
                  />
                  {leader.photoDesc && (
                    <div className="leader-card__caption">
                      <span className="leader-caption-text">{leader.photoDesc}</span>
                    </div>
                  )}
                </div>
                <div className="leader-card__details">
                  <h3 className="leader-card__name">{leader.name}</h3>
                  <span className="leader-card__role">{leader.role}</span>
                  <p className="leader-card__bio">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HorizonArc tone="dark" />

      {/* QUICK LINKS */}
      <section className="section quicklinks">
        <div className="container quicklinks__grid">
          <QuickLink to="/events" title="Events" desc="Services, gatherings, volunteering and our photo gallery." />
          <QuickLink to="/ministries" title="Ministries" desc="The Millerites, The Whites, The Waldensers — and our choir." />
          <QuickLink to="/missions" title="Missions" desc="Where we've been, where we're headed, and how to give." />
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <Link to={to} className="quicklink">
      <span className="quicklink__title">{title}</span>
      <span className="quicklink__desc">{desc}</span>
      <span className="quicklink__arrow">→</span>
    </Link>
  );
}
