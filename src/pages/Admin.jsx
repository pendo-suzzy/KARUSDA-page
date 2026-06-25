import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import "./Admin.css";

const DEMO_CREDENTIALS = {
  username: "karusda",
  password: "church2026",
};

export default function Admin() {
  const { data, setData } = useApp();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcementDraft, setAnnouncementDraft] = useState({ title: "", body: "", date: "" });
  const [missionDraft, setMissionDraft] = useState({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
  const [galleryDraft, setGalleryDraft] = useState({ caption: "", src: "" });
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", time: "", location: "", description: "", category: "services" });
  const [ministryDraft, setMinistryDraft] = useState({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
  const [leaderDraft, setLeaderDraft] = useState({ name: "", role: "", bio: "", photo: "" });
  const [sermonDraft, setSermonDraft] = useState({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
  const [choirDraft, setChoirDraft] = useState({ name: "", members: "", leadName: "", description: "", practiceTimes: "" });

  const handleLogin = (event) => {
    event.preventDefault();
    if (
      loginForm.username === DEMO_CREDENTIALS.username &&
      loginForm.password === DEMO_CREDENTIALS.password
    ) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Demo credentials are karusda / church2026.");
    }
  };

  const addAnnouncement = (event) => {
    event.preventDefault();
    if (!announcementDraft.title || !announcementDraft.body) return;
    setData((current) => ({
      ...current,
      announcements: [
        {
          id: `a-${Date.now()}`,
          title: announcementDraft.title,
          body: announcementDraft.body,
          date: announcementDraft.date || new Date().toISOString(),
          likes: 0,
        },
        ...(current.announcements || []),
      ],
    }));
    setAnnouncementDraft({ title: "", body: "", date: "" });
  };

  const addMission = (event) => {
    event.preventDefault();
    if (!missionDraft.title || !missionDraft.summary) return;
    setData((current) => ({
      ...current,
      missions: {
        ...current.missions,
        upcoming: [
          {
            id: `mu-${Date.now()}`,
            title: missionDraft.title,
            year: missionDraft.year || new Date().getFullYear().toString(),
            summary: missionDraft.summary,
            goalKes: Number(missionDraft.goalKes || 0),
            raisedKes: Number(missionDraft.raisedKes || 0),
          },
          ...(current.missions?.upcoming || []),
        ],
      },
    }));
    setMissionDraft({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
  };

  const addGalleryImage = (event) => {
    event.preventDefault();
    if (!galleryDraft.caption || !galleryDraft.src) return;
    setData((current) => ({
      ...current,
      gallery: [
        { id: `p-${Date.now()}`, src: galleryDraft.src, caption: galleryDraft.caption },
        ...(current.gallery || []),
      ],
    }));
    setGalleryDraft({ caption: "", src: "" });
  };

  const addEvent = (event) => {
    event.preventDefault();
    if (!eventDraft.title || !eventDraft.description) return;
    setData((current) => ({
      ...current,
      events: {
        ...current.events,
        [eventDraft.category]: [
          {
            id: `${eventDraft.category}-${Date.now()}`,
            title: eventDraft.title,
            date: eventDraft.date,
            time: eventDraft.time,
            location: eventDraft.location,
            description: eventDraft.description,
            ...(eventDraft.category === "gatherings" ? { isSabbathEve: false } : {}),
          },
          ...((current.events?.[eventDraft.category] || [])),
        ],
      },
    }));
    setEventDraft({ title: "", date: "", time: "", location: "", description: "", category: eventDraft.category });
  };

  const addMinistry = (event) => {
    event.preventDefault();
    if (!ministryDraft.name || !ministryDraft.description) return;
    setData((current) => ({
      ...current,
      ministries: [
        {
          id: `m-${Date.now()}`,
          name: ministryDraft.name,
          tagline: ministryDraft.tagline,
          description: ministryDraft.description,
          meetingDay: ministryDraft.meetingDay,
          meetingTime: ministryDraft.meetingTime,
        },
        ...(current.ministries || []),
      ],
    }));
    setMinistryDraft({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
  };

  const addLeader = (event) => {
    event.preventDefault();
    if (!leaderDraft.name || !leaderDraft.role) return;
    setData((current) => ({
      ...current,
      leadership: [
        {
          id: `l-${Date.now()}`,
          name: leaderDraft.name,
          role: leaderDraft.role,
          bio: leaderDraft.bio,
          photo: leaderDraft.photo || "https://picsum.photos/seed/leader/300/300",
          photoDesc: `${leaderDraft.name} portrait`,
        },
        ...(current.leadership || []),
      ],
    }));
    setLeaderDraft({ name: "", role: "", bio: "", photo: "" });
  };

  const addSermon = (event) => {
    event.preventDefault();
    if (!sermonDraft.title || !sermonDraft.description) return;
    setData((current) => ({
      ...current,
      sermons: [
        {
          id: `sermon-${Date.now()}`,
          title: sermonDraft.title,
          speaker: sermonDraft.speaker,
          date: sermonDraft.date,
          scripture: sermonDraft.scripture,
          youtubeUrl: sermonDraft.youtubeUrl,
          description: sermonDraft.description,
        },
        ...(current.sermons || []),
      ],
    }));
    setSermonDraft({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
  };

  const updateChoir = (event) => {
    event.preventDefault();
    setData((current) => ({
      ...current,
      choir: {
        ...current.choir,
        name: choirDraft.name || current.choir?.name,
        members: Number(choirDraft.members || current.choir?.members || 0),
        leadName: choirDraft.leadName || current.choir?.leadName,
        description: choirDraft.description || current.choir?.description,
        practiceTimes: choirDraft.practiceTimes
          ? choirDraft.practiceTimes.split("\n").map((line) => {
              const [day, time] = line.split("|");
              return { day: day?.trim(), time: time?.trim() };
            }).filter(Boolean)
          : current.choir?.practiceTimes || [],
      },
    }));
  };

  const stats = useMemo(() => ({
    announcements: data.announcements?.length || 0,
    missions: data.missions?.upcoming?.length || 0,
    galleryItems: data.gallery?.length || 0,
    events: (data.events?.services?.length || 0) + (data.events?.gatherings?.length || 0) + (data.events?.volunteer?.length || 0),
    ministries: data.ministries?.length || 0,
    leaders: data.leadership?.length || 0,
    sermons: data.sermons?.length || 0,
  }), [data]);

  if (!loggedIn) {
    return (
      <div className="section">
        <div className="container admin-login">
          <div className="admin-login__wrap">
            <p className="eyebrow">Admin access</p>
            <h1 className="admin-login__title">Manage KARUSDA content</h1>
            <p className="admin-login__sub">Use the demo login to add updates to announcements, missions, and gallery stories.</p>
            <form className="admin-login__form" onSubmit={handleLogin}>
              <label>
                Username
                <input value={loginForm.username} onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })} />
              </label>
              <label>
                Password
                <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
              </label>
              <button className="footer__submit-btn" type="submit">Sign in</button>
              {error && <p className="admin-login__error">{error}</p>}
            </form>
            <p className="admin-login__hint">Demo credentials: karusda / church2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="admin-panel__header">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="admin-panel__title">Content dashboard</h1>
          </div>
          <p className="admin-login__hint">Signed in as {DEMO_CREDENTIALS.username}</p>
        </div>

        <div className="admin-tabs">
          {[
            ["announcements", "Announcements"],
            ["events", "Events"],
            ["ministries", "Ministries"],
            ["leaders", "Leaders"],
            ["sermons", "Sermons"],
            ["choir", "Choir"],
            ["missions", "Missions"],
            ["gallery", "Gallery"],
          ].map(([key, label]) => (
            <button key={key} className={`admin-tabs__btn ${activeTab === key ? "is-active" : ""}`} onClick={() => setActiveTab(key)} type="button">
              {label}
            </button>
          ))}
        </div>

        <div className="admin-grid">
          <form className="admin-form" onSubmit={
            activeTab === "announcements"
              ? addAnnouncement
              : activeTab === "events"
                ? addEvent
                : activeTab === "ministries"
                  ? addMinistry
                  : activeTab === "leaders"
                    ? addLeader
                    : activeTab === "sermons"
                      ? addSermon
                      : activeTab === "choir"
                        ? updateChoir
                        : activeTab === "missions"
                          ? addMission
                          : addGalleryImage
          }>
            {activeTab === "announcements" && (
              <>
                <h3>Add announcement</h3>
                <label>
                  Title
                  <input value={announcementDraft.title} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, title: event.target.value })} />
                </label>
                <label>
                  Date
                  <input type="date" value={announcementDraft.date} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, date: event.target.value })} />
                </label>
                <label>
                  Body
                  <textarea rows="4" value={announcementDraft.body} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, body: event.target.value })} />
                </label>
              </>
            )}

            {activeTab === "missions" && (
              <>
                <h3>Add mission project</h3>
                <label>
                  Title
                  <input value={missionDraft.title} onChange={(event) => setMissionDraft({ ...missionDraft, title: event.target.value })} />
                </label>
                <label>
                  Year
                  <input value={missionDraft.year} onChange={(event) => setMissionDraft({ ...missionDraft, year: event.target.value })} />
                </label>
                <label>
                  Summary
                  <textarea rows="4" value={missionDraft.summary} onChange={(event) => setMissionDraft({ ...missionDraft, summary: event.target.value })} />
                </label>
                <div className="admin-form__row">
                  <label>
                    Goal (KES)
                    <input type="number" value={missionDraft.goalKes} onChange={(event) => setMissionDraft({ ...missionDraft, goalKes: event.target.value })} />
                  </label>
                  <label>
                    Raised (KES)
                    <input type="number" value={missionDraft.raisedKes} onChange={(event) => setMissionDraft({ ...missionDraft, raisedKes: event.target.value })} />
                  </label>
                </div>
              </>
            )}

            {activeTab === "events" && (
              <>
                <h3>Add event</h3>
                <label>
                  Category
                  <select value={eventDraft.category} onChange={(event) => setEventDraft({ ...eventDraft, category: event.target.value })}>
                    <option value="services">Services</option>
                    <option value="gatherings">Gatherings</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </label>
                <label>
                  Title
                  <input value={eventDraft.title} onChange={(event) => setEventDraft({ ...eventDraft, title: event.target.value })} />
                </label>
                <label>
                  Date
                  <input value={eventDraft.date} onChange={(event) => setEventDraft({ ...eventDraft, date: event.target.value })} />
                </label>
                <label>
                  Time
                  <input value={eventDraft.time} onChange={(event) => setEventDraft({ ...eventDraft, time: event.target.value })} />
                </label>
                <label>
                  Location
                  <input value={eventDraft.location} onChange={(event) => setEventDraft({ ...eventDraft, location: event.target.value })} />
                </label>
                <label>
                  Description
                  <textarea rows="4" value={eventDraft.description} onChange={(event) => setEventDraft({ ...eventDraft, description: event.target.value })} />
                </label>
              </>
            )}

            {activeTab === "ministries" && (
              <>
                <h3>Add ministry</h3>
                <label>
                  Name
                  <input value={ministryDraft.name} onChange={(event) => setMinistryDraft({ ...ministryDraft, name: event.target.value })} />
                </label>
                <label>
                  Tagline
                  <input value={ministryDraft.tagline} onChange={(event) => setMinistryDraft({ ...ministryDraft, tagline: event.target.value })} />
                </label>
                <label>
                  Description
                  <textarea rows="4" value={ministryDraft.description} onChange={(event) => setMinistryDraft({ ...ministryDraft, description: event.target.value })} />
                </label>
                <div className="admin-form__row">
                  <label>
                    Meeting day
                    <input value={ministryDraft.meetingDay} onChange={(event) => setMinistryDraft({ ...ministryDraft, meetingDay: event.target.value })} />
                  </label>
                  <label>
                    Meeting time
                    <input value={ministryDraft.meetingTime} onChange={(event) => setMinistryDraft({ ...ministryDraft, meetingTime: event.target.value })} />
                  </label>
                </div>
              </>
            )}

            {activeTab === "leaders" && (
              <>
                <h3>Add leader</h3>
                <label>
                  Name
                  <input value={leaderDraft.name} onChange={(event) => setLeaderDraft({ ...leaderDraft, name: event.target.value })} />
                </label>
                <label>
                  Role
                  <input value={leaderDraft.role} onChange={(event) => setLeaderDraft({ ...leaderDraft, role: event.target.value })} />
                </label>
                <label>
                  Bio
                  <textarea rows="4" value={leaderDraft.bio} onChange={(event) => setLeaderDraft({ ...leaderDraft, bio: event.target.value })} />
                </label>
                <label>
                  Photo URL
                  <input value={leaderDraft.photo} onChange={(event) => setLeaderDraft({ ...leaderDraft, photo: event.target.value })} />
                </label>
              </>
            )}

            {activeTab === "sermons" && (
              <>
                <h3>Add sermon</h3>
                <label>
                  Title
                  <input value={sermonDraft.title} onChange={(event) => setSermonDraft({ ...sermonDraft, title: event.target.value })} />
                </label>
                <label>
                  Speaker
                  <input value={sermonDraft.speaker} onChange={(event) => setSermonDraft({ ...sermonDraft, speaker: event.target.value })} />
                </label>
                <label>
                  Date
                  <input type="date" value={sermonDraft.date} onChange={(event) => setSermonDraft({ ...sermonDraft, date: event.target.value })} />
                </label>
                <label>
                  Scripture
                  <input value={sermonDraft.scripture} onChange={(event) => setSermonDraft({ ...sermonDraft, scripture: event.target.value })} />
                </label>
                <label>
                  Description
                  <textarea rows="4" value={sermonDraft.description} onChange={(event) => setSermonDraft({ ...sermonDraft, description: event.target.value })} />
                </label>
                <label>
                  YouTube URL
                  <input value={sermonDraft.youtubeUrl} onChange={(event) => setSermonDraft({ ...sermonDraft, youtubeUrl: event.target.value })} />
                </label>
              </>
            )}

            {activeTab === "choir" && (
              <>
                <h3>Update choir profile</h3>
                <label>
                  Name
                  <input value={choirDraft.name} onChange={(event) => setChoirDraft({ ...choirDraft, name: event.target.value })} />
                </label>
                <label>
                  Members
                  <input type="number" value={choirDraft.members} onChange={(event) => setChoirDraft({ ...choirDraft, members: event.target.value })} />
                </label>
                <label>
                  Lead name
                  <input value={choirDraft.leadName} onChange={(event) => setChoirDraft({ ...choirDraft, leadName: event.target.value })} />
                </label>
                <label>
                  Description
                  <textarea rows="4" value={choirDraft.description} onChange={(event) => setChoirDraft({ ...choirDraft, description: event.target.value })} />
                </label>
                <label>
                  Practice times (one per line, day|time)
                  <textarea rows="4" value={choirDraft.practiceTimes} onChange={(event) => setChoirDraft({ ...choirDraft, practiceTimes: event.target.value })} />
                </label>
              </>
            )}

            {activeTab === "gallery" && (
              <>
                <h3>Add gallery image</h3>
                <label>
                  Caption
                  <input value={galleryDraft.caption} onChange={(event) => setGalleryDraft({ ...galleryDraft, caption: event.target.value })} />
                </label>
                <label>
                  Image URL
                  <input value={galleryDraft.src} onChange={(event) => setGalleryDraft({ ...galleryDraft, src: event.target.value })} />
                </label>
              </>
            )}

            <button className="footer__submit-btn" type="submit">Save</button>
          </form>

          <div className="admin-list">
            <div className="admin-form admin-form--inline">
              <h4>Quick overview</h4>
              <div className="admin-overview">
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.announcements}</div>
                  <div className="admin-overview__label">Announcements</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.events}</div>
                  <div className="admin-overview__label">Events</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.ministries}</div>
                  <div className="admin-overview__label">Ministries</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.leaders}</div>
                  <div className="admin-overview__label">Leaders</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.sermons}</div>
                  <div className="admin-overview__label">Sermons</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.missions}</div>
                  <div className="admin-overview__label">Missions</div>
                </div>
                <div className="admin-overview__item">
                  <div className="admin-overview__value">{stats.galleryItems}</div>
                  <div className="admin-overview__label">Gallery</div>
                </div>
              </div>
            </div>

            {activeTab === "announcements" && (data.announcements || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
                <span className="admin-list__meta">{item.date}</span>
              </div>
            ))}

            {activeTab === "missions" && (data.missions?.upcoming || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
                <span className="admin-list__meta">{item.year}</span>
              </div>
            ))}

            {activeTab === "events" && [...(data.events?.services || []), ...(data.events?.gatherings || []), ...(data.events?.volunteer || [])].map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span className="admin-list__meta">{item.date}</span>
              </div>
            ))}

            {activeTab === "ministries" && (data.ministries || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <span className="admin-list__meta">{item.meetingDay}</span>
              </div>
            ))}

            {activeTab === "leaders" && (data.leadership || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.role}</p>
                </div>
                <span className="admin-list__meta">{item.bio}</span>
              </div>
            ))}

            {activeTab === "sermons" && (data.sermons || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span className="admin-list__meta">{item.speaker}</span>
              </div>
            ))}

            {activeTab === "choir" && (
              <div className="admin-list__row">
                <div>
                  <strong>{data.choir?.name}</strong>
                  <p>{data.choir?.description}</p>
                </div>
                <span className="admin-list__meta">{data.choir?.members} members</span>
              </div>
            )}

            {activeTab === "gallery" && (data.gallery || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.caption}</strong>
                  <p>{item.src}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
