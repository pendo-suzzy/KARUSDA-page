import { useMemo, useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";
import "./Admin.css";

export default function Admin() {
  const { data, setData } = useApp();
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcementDraft, setAnnouncementDraft] = useState({ title: "", body: "", date: "" });
  const [missionDraft, setMissionDraft] = useState({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
  const [galleryDraft, setGalleryDraft] = useState({ caption: "", src: "" });
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", time: "", location: "", description: "", category: "services" });
  const [ministryDraft, setMinistryDraft] = useState({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
  const [leaderDraft, setLeaderDraft] = useState({ name: "", role: "", bio: "", photo: "" });
  const [sermonDraft, setSermonDraft] = useState({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
  const [choirVideoDraft, setChoirVideoDraft] = useState({ id: "", title: "", youtubeUrl: "", date: "" });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingMinistryId, setEditingMinistryId] = useState(null);
  const [editingLeaderId, setEditingLeaderId] = useState(null);
  const [editingSermonId, setEditingSermonId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);

  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    let error;
    if (isSignUp) {
      const res = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      error = res.error;

      // If sign up succeeds but requires email confirmation, session will be null
      if (!error && res.data && !res.data.session) {
        setAuthError("Sign up successful! Please check your email to confirm your account.");
        setAuthLoading(false);
        return;
      }
    } else {
      const res = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      error = res.error;
    }
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const saveAnnouncement = (event) => {
    event.preventDefault();
    if (!announcementDraft.title || !announcementDraft.body) return;
    setData((current) => {
      if (editingAnnouncementId) {
        return {
          ...current,
          announcements: (current.announcements || []).map((item) => (item.id === editingAnnouncementId
            ? {
              ...item,
              title: announcementDraft.title,
              body: announcementDraft.body,
              date: announcementDraft.date || item.date,
            }
            : item)),
        };
      }

      return {
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
      };
    });
    setAnnouncementDraft({ title: "", body: "", date: "" });
    setEditingAnnouncementId(null);
  };

  const deleteAnnouncement = (itemId) => {
    setData((current) => ({
      ...current,
      announcements: (current.announcements || []).filter((item) => item.id !== itemId),
    }));
    if (editingAnnouncementId === itemId) {
      setAnnouncementDraft({ title: "", body: "", date: "" });
      setEditingAnnouncementId(null);
    }
  };

  const saveMission = (event) => {
    event.preventDefault();
    if (!missionDraft.title || !missionDraft.summary) return;
    setData((current) => {
      if (editingMissionId) {
        return {
          ...current,
          missions: {
            ...current.missions,
            upcoming: (current.missions?.upcoming || []).map((item) => (item.id === editingMissionId
              ? {
                ...item,
                title: missionDraft.title,
                year: missionDraft.year || item.year,
                summary: missionDraft.summary,
                goalKes: Number(missionDraft.goalKes || item.goalKes || 0),
                raisedKes: Number(missionDraft.raisedKes || item.raisedKes || 0),
              }
              : item)),
          },
        };
      }

      return {
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
      };
    });
    setMissionDraft({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
    setEditingMissionId(null);
  };

  const deleteMission = (itemId) => {
    setData((current) => ({
      ...current,
      missions: {
        ...current.missions,
        upcoming: (current.missions?.upcoming || []).filter((item) => item.id !== itemId),
      },
    }));
    if (editingMissionId === itemId) {
      setMissionDraft({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
      setEditingMissionId(null);
    }
  };

  const saveGalleryImage = (event) => {
    event.preventDefault();
    if (!galleryDraft.caption || !galleryDraft.src) return;
    setData((current) => {
      if (editingGalleryId) {
        return {
          ...current,
          gallery: (current.gallery || []).map((item) => (item.id === editingGalleryId
            ? { ...item, src: galleryDraft.src, caption: galleryDraft.caption }
            : item)),
        };
      }

      return {
        ...current,
        gallery: [
          { id: `p-${Date.now()}`, src: galleryDraft.src, caption: galleryDraft.caption },
          ...(current.gallery || []),
        ],
      };
    });
    setGalleryDraft({ caption: "", src: "" });
    setEditingGalleryId(null);
  };

  const deleteGalleryImage = (itemId) => {
    setData((current) => ({
      ...current,
      gallery: (current.gallery || []).filter((item) => item.id !== itemId),
    }));
    if (editingGalleryId === itemId) {
      setGalleryDraft({ caption: "", src: "" });
      setEditingGalleryId(null);
    }
  };

  const saveEvent = (event) => {
    event.preventDefault();
    if (!eventDraft.title || !eventDraft.description) return;
    setData((current) => {
      if (editingEventId) {
        const nextEvents = Object.entries(current.events || {}).reduce((acc, [category, items]) => {
          acc[category] = (items || []).filter((item) => item.id !== editingEventId);
          return acc;
        }, {});
        const category = eventDraft.category;
        const updatedEvent = {
          id: editingEventId,
          title: eventDraft.title,
          date: eventDraft.date,
          time: eventDraft.time,
          location: eventDraft.location,
          description: eventDraft.description,
          ...(category === "gatherings" ? { isSabbathEve: false } : {}),
        };
        nextEvents[category] = [updatedEvent, ...(nextEvents[category] || [])];
        return {
          ...current,
          events: nextEvents,
        };
      }

      return {
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
      };
    });
    setEventDraft({ title: "", date: "", time: "", location: "", description: "", category: eventDraft.category });
    setEditingEventId(null);
  };

  const deleteEvent = (itemId) => {
    setData((current) => ({
      ...current,
      events: Object.entries(current.events || {}).reduce((acc, [category, items]) => {
        acc[category] = (items || []).filter((item) => item.id !== itemId);
        return acc;
      }, {}),
    }));
    if (editingEventId === itemId) {
      setEventDraft({ title: "", date: "", time: "", location: "", description: "", category: "services" });
      setEditingEventId(null);
    }
  };

  const saveMinistry = (event) => {
    event.preventDefault();
    if (!ministryDraft.name || !ministryDraft.description) return;
    setData((current) => {
      if (editingMinistryId) {
        return {
          ...current,
          ministries: (current.ministries || []).map((item) => (item.id === editingMinistryId
            ? {
              ...item,
              name: ministryDraft.name,
              tagline: ministryDraft.tagline,
              description: ministryDraft.description,
              meetingDay: ministryDraft.meetingDay,
              meetingTime: ministryDraft.meetingTime,
            }
            : item)),
        };
      }

      return {
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
      };
    });
    setMinistryDraft({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
    setEditingMinistryId(null);
  };

  const deleteMinistry = (itemId) => {
    setData((current) => ({
      ...current,
      ministries: (current.ministries || []).filter((item) => item.id !== itemId),
    }));
    if (editingMinistryId === itemId) {
      setMinistryDraft({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
      setEditingMinistryId(null);
    }
  };

  const saveLeader = (event) => {
    event.preventDefault();
    if (!leaderDraft.name || !leaderDraft.role) return;
    setData((current) => {
      if (editingLeaderId) {
        return {
          ...current,
          leadership: (current.leadership || []).map((item) => (item.id === editingLeaderId
            ? {
              ...item,
              name: leaderDraft.name,
              role: leaderDraft.role,
              bio: leaderDraft.bio,
              photo: leaderDraft.photo || item.photo || "https://picsum.photos/seed/leader/300/300",
              photoDesc: `${leaderDraft.name} portrait`,
            }
            : item)),
        };
      }

      return {
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
      };
    });
    setLeaderDraft({ name: "", role: "", bio: "", photo: "" });
    setEditingLeaderId(null);
  };

  const deleteLeader = (itemId) => {
    setData((current) => ({
      ...current,
      leadership: (current.leadership || []).filter((item) => item.id !== itemId),
    }));
    if (editingLeaderId === itemId) {
      setLeaderDraft({ name: "", role: "", bio: "", photo: "" });
      setEditingLeaderId(null);
    }
  };

  const saveSermon = (event) => {
    event.preventDefault();
    if (!sermonDraft.title || !sermonDraft.description) return;
    setData((current) => {
      if (editingSermonId) {
        return {
          ...current,
          sermons: (current.sermons || []).map((item) => (item.id === editingSermonId
            ? {
              ...item,
              title: sermonDraft.title,
              speaker: sermonDraft.speaker,
              date: sermonDraft.date,
              scripture: sermonDraft.scripture,
              youtubeUrl: sermonDraft.youtubeUrl,
              description: sermonDraft.description,
            }
            : item)),
        };
      }

      return {
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
      };
    });
    setSermonDraft({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
    setEditingSermonId(null);
  };

  const deleteSermon = (itemId) => {
    setData((current) => ({
      ...current,
      sermons: (current.sermons || []).filter((item) => item.id !== itemId),
    }));
    if (editingSermonId === itemId) {
      setSermonDraft({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
      setEditingSermonId(null);
    }
  };

  const updateChoir = (event) => {
    event.preventDefault();
    if (!choirVideoDraft.title || !choirVideoDraft.youtubeUrl) return;

    setData((current) => {
      const existingVideos = current.choir?.videos || [];
      const nextVideos = choirVideoDraft.id
        ? existingVideos.map((video) => (video.id === choirVideoDraft.id
          ? {
            ...video,
            title: choirVideoDraft.title || video.title,
            youtubeUrl: choirVideoDraft.youtubeUrl || video.youtubeUrl,
            date: choirVideoDraft.date || video.date,
          }
          : video))
        : [
          {
            id: `cv-${Date.now()}`,
            title: choirVideoDraft.title,
            youtubeUrl: choirVideoDraft.youtubeUrl,
            date: choirVideoDraft.date,
          },
          ...existingVideos,
        ];

      return {
        ...current,
        choir: {
          ...current.choir,
          videos: nextVideos,
        },
      };
    });
    setChoirVideoDraft({ id: "", title: "", youtubeUrl: "", date: "" });
  };

  const deleteChoirVideo = (videoId) => {
    setData((current) => ({
      ...current,
      choir: {
        ...current.choir,
        videos: (current.choir?.videos || []).filter((video) => video.id !== videoId),
      },
    }));
    if (choirVideoDraft.id === videoId) {
      setChoirVideoDraft({ id: "", title: "", youtubeUrl: "", date: "" });
    }
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

  if (!session) {
    return (
      <div className="section" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "400px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{isSignUp ? "Sign Up" : "Admin Login"}</h2>
          {authError && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{authError}</p>}
          <form className="admin-form" onSubmit={handleAuth}>
            <label>
              Email
              <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
            </label>
            <button className="footer__submit-btn" type="submit" disabled={authLoading}>
              {authLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
            </button>
            <p style={{ textAlign: "center", marginTop: "1rem", cursor: "pointer", color: "var(--color-primary)" }} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="admin-panel__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="admin-panel__title">Content dashboard</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="admin-login__hint">Admin dashboard</p>
            <button onClick={handleSignOut} className="footer__submit-btn" style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}>Sign Out</button>
          </div>
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
              ? saveAnnouncement
              : activeTab === "events"
                ? saveEvent
                : activeTab === "ministries"
                  ? saveMinistry
                  : activeTab === "leaders"
                    ? saveLeader
                    : activeTab === "sermons"
                      ? saveSermon
                      : activeTab === "choir"
                        ? updateChoir
                        : activeTab === "missions"
                          ? saveMission
                          : saveGalleryImage
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
                <h3>Manage choir videos</h3>
                <h4>Existing videos</h4>
                {(data.choir?.videos || []).map((video) => (
                  <div key={video.id} className="admin-list__row">
                    <div>
                      <strong>{video.title}</strong>
                      <p>{video.youtubeUrl}</p>
                    </div>
                    <div>
                      <button
                        className="footer__submit-btn"
                        type="button"
                        onClick={() => setChoirVideoDraft({
                          id: video.id,
                          title: video.title,
                          youtubeUrl: video.youtubeUrl,
                          date: video.date || "",
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="footer__submit-btn"
                        type="button"
                        onClick={() => deleteChoirVideo(video.id)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <label>
                  Video title
                  <input value={choirVideoDraft.title} onChange={(event) => setChoirVideoDraft({ ...choirVideoDraft, title: event.target.value })} />
                </label>
                <label>
                  Video date
                  <input type="date" value={choirVideoDraft.date} onChange={(event) => setChoirVideoDraft({ ...choirVideoDraft, date: event.target.value })} />
                </label>
                <label>
                  YouTube URL
                  <input value={choirVideoDraft.youtubeUrl} onChange={(event) => setChoirVideoDraft({ ...choirVideoDraft, youtubeUrl: event.target.value })} />
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
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.date}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setAnnouncementDraft({ title: item.title, body: item.body, date: item.date || "" });
                    setEditingAnnouncementId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteAnnouncement(item.id)}>Delete</button>
                </div>
              </div>
            ))}

            {activeTab === "missions" && (data.missions?.upcoming || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.year}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setMissionDraft({ title: item.title, year: item.year || "", summary: item.summary, goalKes: item.goalKes || "", raisedKes: item.raisedKes || "" });
                    setEditingMissionId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteMission(item.id)}>Delete</button>
                </div>
              </div>
            ))}

            {activeTab === "events" && [...(data.events?.services || []), ...(data.events?.gatherings || []), ...(data.events?.volunteer || [])].map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.date}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setEventDraft({ title: item.title, date: item.date || "", time: item.time || "", location: item.location || "", description: item.description || "", category: item.category || "services" });
                    setEditingEventId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteEvent(item.id)}>Delete</button>
                </div>
              </div>
            ))}

            {activeTab === "ministries" && (data.ministries || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.meetingDay}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setMinistryDraft({ name: item.name, tagline: item.tagline || "", description: item.description || "", meetingDay: item.meetingDay || "", meetingTime: item.meetingTime || "" });
                    setEditingMinistryId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteMinistry(item.id)}>Delete</button>
                </div>
              </div>
            ))}

            {activeTab === "leaders" && (data.leadership || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.role}</p>
                </div>
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.bio}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setLeaderDraft({ name: item.name, role: item.role || "", bio: item.bio || "", photo: item.photo || "" });
                    setEditingLeaderId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteLeader(item.id)}>Delete</button>
                </div>
              </div>
            ))}

            {activeTab === "sermons" && (data.sermons || []).map((item) => (
              <div key={item.id} className="admin-list__row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <div className="admin-list__actions">
                  <span className="admin-list__meta">{item.speaker}</span>
                  <button className="admin-delete" type="button" onClick={() => {
                    setSermonDraft({ title: item.title, speaker: item.speaker || "", date: item.date || "", scripture: item.scripture || "", description: item.description || "", youtubeUrl: item.youtubeUrl || "" });
                    setEditingSermonId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteSermon(item.id)}>Delete</button>
                </div>
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
                <div className="admin-list__actions">
                  <button className="admin-delete" type="button" onClick={() => {
                    setGalleryDraft({ caption: item.caption, src: item.src });
                    setEditingGalleryId(item.id);
                  }}>Edit</button>
                  <button className="admin-delete" type="button" onClick={() => deleteGalleryImage(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
