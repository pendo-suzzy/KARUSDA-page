import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import AnnouncementCard from "../components/AnnouncementCard";
import { useApp } from "../context/AppContext";
import { normalizeUrl } from "../lib/urlHelpers";
import "./Home.css";

export default function Home() {
  const { data } = useApp();
  const { announcements = [], stats = {}, leadership = [], sermons = [] } = data;

  const weekSchedule = [
    { day: "Sun", label: "Choir Practice", time: "2:00 PM", color: "#C2A056" },
    { day: "Mon", label: "Ministry Meetings", time: "5:00 PM", color: "#E07B54" },
    { day: "Tue", label: "AMO & ALO Fellowship", time: "5:30 PM", color: "#6B8F71" },
    { day: "Wed", label: "Midweek Vespers", time: "5:30 PM", color: "#7B9EBE" },
    { day: "Thu", label: "Choir Practice", time: "5:00 PM", color: "#C2A056" },
    { day: "Fri", label: "Friday Vespers", time: "5:00 PM", color: "#E07B54" },
    { day: "Sat", label: "Sabbath Worship", time: "7:00 AM", color: "#A855F7" },
  ];

  return (
    <div className="home-page">
      <HeroSlider>
        <div className="hero__content">
          <p className="hero__eyebrow">Welcome to</p>
          <h1 className="hero__title">KARUSDA</h1>
          <p className="hero__subtitle">
            Karatina University Seventh-day Adventist Church — worship, fellowship,
            and mission in one joyful community.
          </p>
          <div className="hero__actions">
            <Link to="/events" className="button button--primary">
              View upcoming events
            </Link>
            <a
              href="https://www.youtube.com/channel/UCmFWvxiBFvwYkJbsQ8zdMXg"
              target="_blank"
              rel="noreferrer"
              className="button button--secondary"
            >
              Youtube Chanel
            </a>
            <a href="#announcements" className="button button--secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              Read announcements
            </a>
          </div>
        </div>
      </HeroSlider>

      {/* Weekly Schedule Summary */}
      <section className="week-schedule">
        <div className="container">
          <p className="week-schedule__eyebrow">This Week at KARUSDA</p>
          <h2 className="week-schedule__title">Weekly Activities at a Glance</h2>
          <div className="week-schedule__timeline">
            {weekSchedule.map((item) => (
              <div key={item.day} className="week-day-card" style={{ "--day-color": item.color }}>
                <div className="week-day-card__day">{item.day}</div>
                <div className="week-day-card__dot" />
                <div className="week-day-card__info">
                  <span className="week-day-card__label">{item.label}</span>
                  <span className="week-day-card__time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats__grid">
            <div className="stat">
              <span className="stat__value">10+</span>
              <span className="stat__label">Years of ministry</span>
            </div>
            <div className="stat">
              <span className="stat__value">600+</span>
              <span className="stat__label">Members</span>
            </div>
            <div className="stat">
              <span className="stat__value">3</span>
              <span className="stat__label">Ministries</span>
            </div>
            <div className="stat">
              <span className="stat__value">32+</span>
              <span className="stat__label">Choir vocalists</span>
            </div>
          </div>
        </div>
      </section>

      <section id="announcements" className="section">
        <div className="container">
          <h2 className="section__title">Latest announcements</h2>
          <p className="section__intro">
            Stay grounded in the week ahead with the latest updates from the church.
          </p>
          <div className="announcements__grid">
            {announcements.slice(0, 3).map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned Quick Navigation Cards */}
      <section className="quicklinks">
        <div className="container">
          <p className="week-schedule__eyebrow" style={{ color: "rgba(255,252,244,0.6)" }}>Explore</p>
          <h2 className="section__title" style={{ color: "var(--paper)", marginBottom: "var(--space-4)" }}>Find your place in the church</h2>
          <div className="quicklinks__grid">
            <Link to="/ministries" className="quicklink quicklink--ministries">
              <div className="quicklink__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="quicklink__body">
                <span className="quicklink__title">Ministries</span>
                <span className="quicklink__desc">Discover the groups shaping worship, discipleship, and service across campus.</span>
                <span className="quicklink__arrow">Explore →</span>
              </div>
            </Link>
            <Link to="/missions" className="quicklink quicklink--missions">
              <div className="quicklink__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div className="quicklink__body">
                <span className="quicklink__title">Missions</span>
                <span className="quicklink__desc">See how our church reaches out in the community and beyond Kenya's borders.</span>
                <span className="quicklink__arrow">Learn more →</span>
              </div>
            </Link>
            <Link to="/events" className="quicklink quicklink--events">
              <div className="quicklink__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div className="quicklink__body">
                <span className="quicklink__title">Events</span>
                <span className="quicklink__desc">Find Sabbath worship services, vespers, and fellowship opportunities.</span>
                <span className="quicklink__arrow">Join us →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="leaders" className="leaders">
        <div className="container">
          <h2 className="section__title">Meet the leadership</h2>
          <p className="section__intro">
            Dedicated servants guiding the church in worship, care, and outreach.
          </p>
          <div className="leaders__grid">
            {leadership.slice(0, 3).map((person) => (
              <article key={person.id} className="leader-card">
                <div className="leader-card__image-wrap">
                  <img src={normalizeUrl(person.photo)} alt={person.name} className="leader-card__image" />
                </div>
                <div className="leader-card__details">
                  <h3 className="leader-card__name">{person.name}</h3>
                  <span className="leader-card__role">{person.role}</span>
                  <p className="leader-card__bio">{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sermons" className="section">
        <div className="container">
          <h2 className="section__title">Recent sermons</h2>
          <p className="section__intro">
            Encouragement and instruction for the journey of faith.
          </p>
          <div className="announcements__grid">
            {sermons.slice(0, 2).map((sermon) => {
              const rawUrl = sermon.youtubeUrl || sermon.youtube_url;
              const link = normalizeUrl(rawUrl);
              const inner = (
                <>
                  <p className="announcement-card__date">{sermon.date}</p>
                  <h3 className="announcement-card__title">
                    {sermon.title} {link && <span style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>▶</span>}
                  </h3>
                  <p className="announcement-card__body">{sermon.description}</p>
                </>
              );
              return link ? (
                <a key={sermon.id} href={link} target="_blank" rel="noopener noreferrer" className="announcement-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {inner}
                </a>
              ) : (
                <article key={sermon.id} className="announcement-card">
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

