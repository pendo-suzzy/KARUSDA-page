import { useMemo, useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";
import { normalizeUrl } from "../lib/urlHelpers";
import "./Admin.css";

export default function Admin() {
  const { data, setData, syncItem, removeItem, getUniqueId } = useApp();
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcementDraft, setAnnouncementDraft] = useState({ title: "", body: "", date: "", imageUrl: "" });
  const [missionDraft, setMissionDraft] = useState({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
  const [galleryDraft, setGalleryDraft] = useState({ caption: "", src: "" });
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", time: "", location: "", description: "", category: "services", imageUrl: "" });
  const [ministryDraft, setMinistryDraft] = useState({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
  const [leadershipDraft, setLeadershipDraft] = useState({ name: "", role: "", bio: "", photo: "" });
  const [sermonDraft, setSermonDraft] = useState({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
  const [choirVideoDraft, setChoirVideoDraft] = useState({ id: "", title: "", youtubeUrl: "", date: "" });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingMinistryId, setEditingMinistryId] = useState(null);
  const [editingLeadershipId, setEditingLeadershipId] = useState(null);
  const [editingSermonId, setEditingSermonId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event, callback) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
        return;
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      if (data && data.publicUrl) {
        callback(data.publicUrl);
        alert("Image uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const normalizedGalleryUrl = normalizeUrl(galleryDraft.src?.trim());
  const normalizedSermonUrl = normalizeUrl(sermonDraft.youtubeUrl?.trim());
  const normalizedChoirUrl = normalizeUrl(choirVideoDraft.youtubeUrl?.trim());

  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const res = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    const error = res.error;

    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const persistItem = async ({ table, item }) => {
    try {
      await syncItem({ table_name: table, item });
    } catch (err) {
      console.error(`Failed to persist ${table}:`, err);
    }
  };

  const removePersistedItem = async ({ table, id }) => {
    try {
      await removeItem({ table_name: table, id });
    } catch (err) {
      console.error(`Failed to delete persisted ${table} row:`, err);
    }
  };

  const saveAnnouncement = async (event) => {
    event.preventDefault();
    if (!announcementDraft.title || !announcementDraft.body) return;
    const announcement = {
      id: editingAnnouncementId || `a-${Date.now()}`,
      title: announcementDraft.title,
      body: announcementDraft.body,
      date: announcementDraft.date || new Date().toISOString(),
      imageUrl: announcementDraft.imageUrl || "",
      likes: 0,
    };
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
              imageUrl: announcementDraft.imageUrl || item.imageUrl || "",
            }
            : item)),
        };
      }

      return {
        ...current,
        announcements: [
          announcement,
          ...(current.announcements || []),
        ],
      };
    });
    await persistItem({ table: "announcements", item: announcement });
    setAnnouncementDraft({ title: "", body: "", date: "", imageUrl: "" });
    setEditingAnnouncementId(null);
  };

  const deleteAnnouncement = (itemId) => {
    setData((current) => ({
      ...current,
      announcements: (current.announcements || []).filter((item) => item.id !== itemId),
    }));
    removePersistedItem({ table: "announcements", id: itemId });
    if (editingAnnouncementId === itemId) {
      setAnnouncementDraft({ title: "", body: "", date: "", imageUrl: "" });
      setEditingAnnouncementId(null);
    }
  };

  const saveMission = async (event) => {
    event.preventDefault();
    if (!missionDraft.title || !missionDraft.summary) return;
    const mission = {
      id: editingMissionId || `mu-${Date.now()}`,
      title: missionDraft.title,
      year: missionDraft.year || new Date().getFullYear().toString(),
      summary: missionDraft.summary,
      goalKes: Number(missionDraft.goalKes || 0),
      raisedKes: Number(missionDraft.raisedKes || 0),
      upcoming: true,
    };
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
            mission,
            ...(current.missions?.upcoming || []),
          ],
        },
      };
    });
    await persistItem({ table: "missions", item: mission });
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
    removePersistedItem({ table: "missions", id: itemId });
    if (editingMissionId === itemId) {
      setMissionDraft({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
      setEditingMissionId(null);
    }
  };

  const saveGalleryImage = async (event) => {
    event.preventDefault();
    if (!galleryDraft.caption || !galleryDraft.src) return;
    const normalizedSrc = normalizeUrl(galleryDraft.src.trim());
    const galleryItem = {
      id: editingGalleryId || `p-${Date.now()}`,
      src: normalizedSrc,
      caption: galleryDraft.caption,
    };
    setData((current) => {
      if (editingGalleryId) {
        return {
          ...current,
          gallery: (current.gallery || []).map((item) => (item.id === editingGalleryId
            ? { ...item, src: normalizedSrc, caption: galleryDraft.caption }
            : item)),
        };
      }

      return {
        ...current,
        gallery: [
          galleryItem,
          ...(current.gallery || []),
        ],
      };
    });
    await persistItem({ table: "gallery", item: galleryItem });
    setGalleryDraft({ caption: "", src: "" });
    setEditingGalleryId(null);
  };

  const deleteGalleryImage = (itemId) => {
    setData((current) => ({
      ...current,
      gallery: (current.gallery || []).filter((item) => item.id !== itemId),
    }));
    removePersistedItem({ table: "gallery", id: itemId });
    if (editingGalleryId === itemId) {
      setGalleryDraft({ caption: "", src: "" });
      setEditingGalleryId(null);
    }
  };

  const saveEvent = async (event) => {
    event.preventDefault();
    if (!eventDraft.title || !eventDraft.description) return;
    const newEvent = {
      id: editingEventId || `${eventDraft.category}-${Date.now()}`,
      title: eventDraft.title,
      date: eventDraft.date,
      time: eventDraft.time,
      location: eventDraft.location,
      description: eventDraft.description,
      imageUrl: eventDraft.imageUrl || "",
      category: eventDraft.category,
      ...(eventDraft.category === "gatherings" ? { isSabbathEve: false } : {}),
    };
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
          imageUrl: eventDraft.imageUrl || "",
          ...(category === "gatherings" ? { isSabbathEve: false } : {}),
        };
        nextEvents[category] = [updatedEvent, ...(nextEvents[category] || [])];
        persistItem({ table: "events", item: updatedEvent });
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
            newEvent,
            ...((current.events?.[eventDraft.category] || [])),
          ],
        },
      };
    });
    if (!editingEventId) {
      await persistItem({ table: "events", item: newEvent });
    }
    setEventDraft({ title: "", date: "", time: "", location: "", description: "", category: eventDraft.category, imageUrl: "" });
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
    removePersistedItem({ table: "events", id: itemId });
    if (editingEventId === itemId) {
      setEventDraft({ title: "", date: "", time: "", location: "", description: "", category: "services", imageUrl: "" });
      setEditingEventId(null);
    }
  };

  const saveMinistry = async (event) => {
    event.preventDefault();
    if (!ministryDraft.name || !ministryDraft.description) return;
    const ministry = {
      id: editingMinistryId || `m-${Date.now()}`,
      name: ministryDraft.name,
      tagline: ministryDraft.tagline,
      description: ministryDraft.description,
      meetingDay: ministryDraft.meetingDay,
      meetingTime: ministryDraft.meetingTime,
    };
    setData((current) => {
      if (editingMinistryId) {
        return {
          ...current,
          ministries: (current.ministries || []).map((item) => (item.id === editingMinistryId
            ? {
              ...ministry,
            }
            : item)),
        };
      }

      return {
        ...current,
        ministries: [
          ministry,
          ...(current.ministries || []),
        ],
      };
    });
    await persistItem({ table: "ministries", item: ministry });
    setMinistryDraft({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
    setEditingMinistryId(null);
  };

  const deleteMinistry = (itemId) => {
    setData((current) => ({
      ...current,
      ministries: (current.ministries || []).filter((item) => item.id !== itemId),
    }));
    removePersistedItem({ table: "ministries", id: itemId });
    if (editingMinistryId === itemId) {
      setMinistryDraft({ name: "", tagline: "", description: "", meetingDay: "", meetingTime: "" });
      setEditingMinistryId(null);
    }
  };

  const saveLeadership = async (event) => {
    event.preventDefault();
    if (!leadershipDraft.name || !leadershipDraft.role) return;
    const normalizedPhoto = normalizeUrl(leadershipDraft.photo?.trim());
    const leadershipItem = {
      id: editingLeadershipId || `l-${Date.now()}`,
      name: leadershipDraft.name,
      role: leadershipDraft.role,
      bio: leadershipDraft.bio,
      photo: normalizedPhoto || "",
      photoDesc: `${leadershipDraft.name} portrait`,
    };
    setData((current) => {
      if (editingLeadershipId) {
        return {
          ...current,
          leadership: (current.leadership || []).map((item) => (item.id === editingLeadershipId
            ? {
              ...leadershipItem,
            }
            : item)),
        };
      }

      return {
        ...current,
        leadership: [
          leadershipItem,
          ...(current.leadership || []),
        ],
      };
    });
    await persistItem({ table: "leadership", item: leadershipItem });
    setLeadershipDraft({ name: "", role: "", bio: "", photo: "" });
    setEditingLeadershipId(null);
  };

  const deleteLeadership = (itemId) => {
    setData((current) => ({
      ...current,
      leadership: (current.leadership || []).filter((item) => item.id !== itemId),
    }));
    removePersistedItem({ table: "leadership", id: itemId });
    if (editingLeadershipId === itemId) {
      setLeadershipDraft({ name: "", role: "", bio: "", photo: "" });
      setEditingLeadershipId(null);
    }
  };

  const saveSermon = async (event) => {
    event.preventDefault();
    if (!sermonDraft.title || !sermonDraft.description) return;
    const normalizedLink = normalizeUrl(sermonDraft.youtubeUrl?.trim());
    const sermon = {
      id: editingSermonId || `sermon-${Date.now()}`,
      title: sermonDraft.title,
      speaker: sermonDraft.speaker,
      date: sermonDraft.date,
      scripture: sermonDraft.scripture,
      youtubeUrl: normalizedLink,
      description: sermonDraft.description,
    };
    setData((current) => {
      if (editingSermonId) {
        return {
          ...current,
          sermons: (current.sermons || []).map((item) => (item.id === editingSermonId
            ? {
              ...sermon,
            }
            : item)),
        };
      }

      return {
        ...current,
        sermons: [
          sermon,
          ...(current.sermons || []),
        ],
      };
    });
    await persistItem({ table: "sermons", item: sermon });
    setSermonDraft({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
    setEditingSermonId(null);
  };

  const deleteSermon = (itemId) => {
    setData((current) => ({
      ...current,
      sermons: (current.sermons || []).filter((item) => item.id !== itemId),
    }));
    removePersistedItem({ table: "sermons", id: itemId });
    if (editingSermonId === itemId) {
      setSermonDraft({ title: "", speaker: "", date: "", scripture: "", description: "", youtubeUrl: "" });
      setEditingSermonId(null);
    }
  };

  const updateChoir = async (event) => {
    event.preventDefault();
    if (!choirVideoDraft.title || !choirVideoDraft.youtubeUrl) return;
    const normalizedLink = normalizeUrl(choirVideoDraft.youtubeUrl?.trim());
    const video = {
      id: choirVideoDraft.id || `cv-${Date.now()}`,
      title: choirVideoDraft.title,
      youtubeUrl: normalizedLink,
      date: choirVideoDraft.date,
    };

    setData((current) => {
      const existingVideos = current.choir?.videos || [];
      const nextVideos = choirVideoDraft.id
        ? existingVideos.map((video) => (video.id === choirVideoDraft.id
          ? {
            ...video,
            title: choirVideoDraft.title || video.title,
            youtubeUrl: normalizedLink || video.youtubeUrl,
            date: choirVideoDraft.date || video.date,
          }
          : video))
        : [
          video,
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
    await persistItem({ table: "choir", item: video });
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
    removePersistedItem({ table: "choir", id: videoId });
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
    leadership: data.leadership?.length || 0,
    sermons: data.sermons?.length || 0,
  }), [data]);

  if (!session) {
    return (
      <div className="section" style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "400px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Admin Login</h2>
          {authError && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{authError}</p>}
          <form className="admin-form" onSubmit={handleAuth}>
            <label>
              Email
              <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <div className="admin-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
                <button
                  className="admin-password-toggle"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M9.88 5.08A10.94 10.94 0 0 1 12 5c5.18 0 9.27 3.77 10 7-.58 1.42-1.64 2.92-3.02 4.13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.61 6.61C4.67 7.89 3.16 9.68 2 12c.73 1.79 2.17 3.44 4.08 4.63" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
            <button className="footer__submit-btn" type="submit" disabled={authLoading}>
              {authLoading ? "Loading..." : "Login"}
            </button>
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
            ["leadership", "Leadership"],
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
                  : activeTab === "leadership"
                    ? saveLeadership
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
                <label>
                  Image URL (Optional)
                  <input value={announcementDraft.imageUrl} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, imageUrl: event.target.value })} placeholder="Enter URL or upload a file below" />
                </label>
                <label>
                  Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setAnnouncementDraft({ ...announcementDraft, imageUrl: url }))} />
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
                <label>
                  Image URL (Optional)
                  <input value={eventDraft.imageUrl} onChange={(event) => setEventDraft({ ...eventDraft, imageUrl: event.target.value })} placeholder="Enter URL or upload a file below" />
                </label>
                <label>
                  Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEventDraft({ ...eventDraft, imageUrl: url }))} />
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

            {activeTab === "leadership" && (
              <div className="admin-card">
                <h2>{editingLeadershipId ? "Edit Leadership" : "Add Leadership"}</h2>
                <div className="form-group">
                  <label>Name</label>
                  <input value={leadershipDraft.name} onChange={(event) => setLeadershipDraft({ ...leadershipDraft, name: event.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input value={leadershipDraft.role} onChange={(event) => setLeadershipDraft({ ...leadershipDraft, role: event.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={leadershipDraft.bio} onChange={(event) => setLeadershipDraft({ ...leadershipDraft, bio: event.target.value })} rows="3" />
                </div>
                <div className="form-group">
                  <label>Photo URL</label>
                  <input value={leadershipDraft.photo} onChange={(event) => setLeadershipDraft({ ...leadershipDraft, photo: event.target.value })} />
                </div>
                <div className="form-group">
                  <label>Upload Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setLeadershipDraft({ ...leadershipDraft, photo: url }))} />
                </div>
                <div className="form-actions">
                  {editingLeadershipId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingLeadershipId(null);
                        setLeadershipDraft({ name: "", role: "", bio: "", photo: "" });
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
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
                <p className="admin-form__preview">
                  Normalized link: <code>{normalizedSermonUrl || "Enter a YouTube link above"}</code>
                </p>
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
                      <p>
                        {video.youtubeUrl ? (
                          <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                            {video.youtubeUrl}
                          </a>
                        ) : (
                          "No video URL provided"
                        )}
                      </p>
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
                <p className="admin-form__preview">
                  Normalized link: <code>{normalizedChoirUrl || "Enter a YouTube link above"}</code>
                </p>
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
                  <input value={galleryDraft.src} onChange={(event) => setGalleryDraft({ ...galleryDraft, src: event.target.value })} placeholder="Enter URL or upload a file below" />
                </label>
                <label>
                  Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setGalleryDraft({ ...galleryDraft, src: url }))} />
                </label>
                <p className="admin-form__preview">
                  Normalized link: <code>{normalizedGalleryUrl || "Enter an image link above"}</code>
                </p>
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
                  <div className="admin-overview__value">{stats.leadership}</div>
                  <div className="admin-overview__label">Leadership</div>
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
                    setAnnouncementDraft({ title: item.title, body: item.body, date: item.date || "", imageUrl: item.imageUrl || "" });
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
                    setEventDraft({ title: item.title, date: item.date || "", time: item.time || "", location: item.location || "", description: item.description || "", category: item.category || "services", imageUrl: item.imageUrl || "" });
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

            {activeTab === "leadership" && (data.leadership || []).map((item) => (
              <div key={item.id} className="list-item">
                <div className="list-item-content">
                  <h4>{item.name}</h4>
                  <p>{item.role}</p>
                </div>
                <div className="list-item-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingLeadershipId(item.id);
                      setLeadershipDraft({ name: item.name, role: item.role, bio: item.bio || "", photo: item.photo || "" });
                      window.scrollTo(0, 0);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => deleteLeadership(item.id)}>Delete</button>
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
                  <p>
                    {item.src ? (
                      <a href={item.src} target="_blank" rel="noopener noreferrer">
                        {item.src}
                      </a>
                    ) : (
                      "No image URL provided"
                    )}
                  </p>
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
