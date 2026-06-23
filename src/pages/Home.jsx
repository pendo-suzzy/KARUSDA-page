import { useRef } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import SabbathHorizon from "../components/SabbathHorizon";
import AnnouncementCard from "../components/AnnouncementCard";
import "./Home.css";

export default function Home() {
  const { data } = useApp();
  const announcementsRef = useRef(null);

  const scrollToAnnouncements = () => {
    announcementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <video
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
        >
          {/* Drop your own clip of a service in session here — keep it muted/ambient */}
          <source src="/videos/hero-worship.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />

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
            <a href="#sermon" className="btn btn-solid">
              Watch Sermon
            </a>
            <button className="btn btn-outline" onClick={scrollToAnnouncements}>
              Announcements
            </button>
          </div>
        </div>
      </section>

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
