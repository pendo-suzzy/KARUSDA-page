import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import AnnouncementCard from "../components/AnnouncementCard";
import { useApp } from "../context/AppContext";
import "./Home.css";

export default function Home() {
  const { data } = useApp();
  const { announcements = [], stats = {}, leadership = [], sermons = [] } = data;

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
            <Link to="/ministries" className="button button--secondary">
              Explore ministries
            </Link>
          </div>
        </div>
      </HeroSlider>

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

      <section className="section">
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

      <section className="quicklinks">
        <div className="container">
          <div className="quicklinks__grid">
            <Link to="/ministries" className="quicklink">
              <span className="quicklink__title">Ministries</span>
              <span className="quicklink__desc">Discover the groups shaping worship, discipleship, and service.</span>
              <span className="quicklink__arrow">→ Explore</span>
            </Link>
            <Link to="/missions" className="quicklink">
              <span className="quicklink__title">Missions</span>
              <span className="quicklink__desc">See how our church reaches out in the community and beyond.</span>
              <span className="quicklink__arrow">→ Learn more</span>
            </Link>
            <Link to="/events" className="quicklink">
              <span className="quicklink__title">Events</span>
              <span className="quicklink__desc">Find Sabbath worship, vespers, and fellowship opportunities.</span>
              <span className="quicklink__arrow">→ Join us</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="leaders">
        <div className="container">
          <h2 className="section__title">Meet the leadership</h2>
          <p className="section__intro">
            Dedicated servants guiding the church in worship, care, and outreach.
          </p>
          <div className="leaders__grid">
            {leadership.slice(0, 3).map((person) => (
              <article key={person.id} className="leader-card">
                <div className="leader-card__image-wrap">
                  <img src={person.photo} alt={person.name} className="leader-card__image" />
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

      <section className="section">
        <div className="container">
          <h2 className="section__title">Recent sermons</h2>
          <p className="section__intro">
            Encouragement and instruction for the journey of faith.
          </p>
          <div className="announcements__grid">
            {sermons.slice(0, 2).map((sermon) => (
              <article key={sermon.id} className="announcement-card">
                <p className="announcement-card__date">{sermon.date}</p>
                <h3 className="announcement-card__title">{sermon.title}</h3>
                <p className="announcement-card__body">{sermon.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
