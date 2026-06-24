import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Admin.css";

const TABS = ["Announcements", "Events", "Gallery", "Ministries", "Choir", "Leadership", "Sermons", "Missions"];

export default function Admin() {
  const { isAdmin, login, logout } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Announcements");

  const handleLogin = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError("That username or password isn't right. Try again.");
    } else {
      setError("");
    }
  };

  if (!isAdmin) {
    return (
      <section className="section admin-login">
        <div className="container admin-login__wrap">
          <p className="eyebrow">Admin</p>
          <h1 className="admin-login__title">Sign in to manage KARUSDA</h1>
          <p className="admin-login__sub">
            This area is for church admins only. Everyone else can browse the
            site freely without signing in.
          </p>
          <form onSubmit={handleLogin} className="admin-login__form">
            <label>
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="admin-login__error">{error}</p>}
            <button type="submit" className="btn btn-solid">Sign in</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-panel">
      <div className="container">
        <div className="admin-panel__header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="admin-panel__title">Manage KARUSDA</h1>
          </div>
          <button className="btn btn-outline" style={{ color: "var(--ink)", borderColor: "var(--ink)" }} onClick={logout}>
            Sign out
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-tabs__btn ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="admin-panel__body">
          {tab === "Announcements" && <AnnouncementsAdmin />}
          {tab === "Events" && <EventsAdmin />}
          {tab === "Gallery" && <GalleryAdmin />}
          {tab === "Ministries" && <MinistriesAdmin />}
          {tab === "Choir" && <ChoirAdmin />}
          {tab === "Leadership" && <LeadershipAdmin />}
          {tab === "Sermons" && <SermonsAdmin />}
          {tab === "Missions" && <MissionsAdmin />}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Announcements ---------------- */
function AnnouncementsAdmin() {
  const { data, addAnnouncement, deleteAnnouncement } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !body) return;
    addAnnouncement({ title, body, date: new Date().toISOString().slice(0, 10) });
    setTitle("");
    setBody("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add announcement</h3>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label>Body<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} required /></label>
        <button className="btn btn-solid" type="submit">Add announcement</button>
      </form>

      <div className="admin-list">
        <h3>Current announcements</h3>
        {data.announcements.map((a) => (
          <div className="admin-list__row" key={a.id}>
            <div>
              <strong>{a.title}</strong>
              <p>{a.body}</p>
              <span className="admin-list__meta">{a.likes} likes</span>
            </div>
            <button className="admin-delete" onClick={() => deleteAnnouncement(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Events ---------------- */
function EventsAdmin() {
  const { data, addEvent, deleteEvent } = useApp();
  const [category, setCategory] = useState("services");
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", description: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title) return;
    addEvent(category, form);
    setForm({ title: "", date: "", time: "", location: "", description: "" });
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add event</h3>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="services">Services</option>
            <option value="gatherings">Gatherings</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </label>
        <label>Title<input value={form.title} onChange={update("title")} required /></label>
        <label>Date / recurrence<input value={form.date} onChange={update("date")} placeholder="Every Tuesday" /></label>
        <label>Time<input value={form.time} onChange={update("time")} placeholder="5:30 PM" /></label>
        <label>Location<input value={form.location} onChange={update("location")} /></label>
        <label>Description<textarea value={form.description} onChange={update("description")} rows={3} /></label>
        <button className="btn btn-solid" type="submit">Add event</button>
      </form>

      <div className="admin-list">
        {["services", "gatherings", "volunteer"].map((cat) => (
          <div key={cat}>
            <h3 style={{ textTransform: "capitalize" }}>{cat}</h3>
            {data.events[cat].map((e) => (
              <div className="admin-list__row" key={e.id}>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.date} · {e.time} · {e.location}</p>
                </div>
                <button className="admin-delete" onClick={() => deleteEvent(cat, e.id)}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Gallery ---------------- */
function GalleryAdmin() {
  const { data, addGalleryItem, deleteGalleryItem } = useApp();
  const [src, setSrc] = useState("");
  const [caption, setCaption] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!src) return;
    addGalleryItem({ src, caption });
    setSrc("");
    setCaption("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add photo</h3>
        <label>Image URL<input value={src} onChange={(e) => setSrc(e.target.value)} required /></label>
        <label>Caption<input value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
        <button className="btn btn-solid" type="submit">Add to gallery</button>
      </form>

      <div className="admin-gallery-grid">
        {data.gallery.map((g) => (
          <div className="admin-gallery-grid__item" key={g.id}>
            <img src={g.src} alt={g.caption} />
            <button className="admin-delete" onClick={() => deleteGalleryItem(g.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Ministries ---------------- */
function MinistriesAdmin() {
  const { data, updateMinistry } = useApp();

  return (
    <div className="admin-list">
      <h3>Edit ministries</h3>
      {data.ministries.map((m) => (
        <form
          key={m.id}
          className="admin-form admin-form--inline"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            updateMinistry(m.id, {
              description: fd.get("description"),
              meetingDay: fd.get("meetingDay"),
              meetingTime: fd.get("meetingTime"),
            });
          }}
        >
          <h4>{m.name}</h4>
          <label>Description<textarea name="description" defaultValue={m.description} rows={3} /></label>
          <div className="admin-form__row">
            <label>Day<input name="meetingDay" defaultValue={m.meetingDay} /></label>
            <label>Time<input name="meetingTime" defaultValue={m.meetingTime} /></label>
          </div>
          <button className="btn btn-solid" type="submit">Save {m.name}</button>
        </form>
      ))}
    </div>
  );
}

/* ---------------- Choir ---------------- */
function ChoirAdmin() {
  const { data, updateChoir, addChoirVideo, deleteChoirVideo } = useApp();
  const { choir } = data;
  const [videoTitle, setVideoTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSaveDetails = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    updateChoir({
      members: Number(fd.get("members")),
      leadName: fd.get("leadName"),
      description: fd.get("description"),
    });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoTitle || !youtubeUrl) return;
    addChoirVideo({ title: videoTitle, youtubeUrl });
    setVideoTitle("");
    setYoutubeUrl("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleSaveDetails}>
        <h3>Edit choir details</h3>
        <label>Number of vocalists<input name="members" type="number" defaultValue={choir.members} /></label>
        <label>Choir lead<input name="leadName" defaultValue={choir.leadName} /></label>
        <label>Description<textarea name="description" defaultValue={choir.description} rows={3} /></label>
        <button className="btn btn-solid" type="submit">Save choir details</button>
      </form>

      <div>
        <form className="admin-form" onSubmit={handleAddVideo} style={{ marginBottom: "2rem" }}>
          <h3>Add choir video</h3>
          <label>Video Title<input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required /></label>
          <label>YouTube URL<input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required placeholder="https://www.youtube.com/watch?v=..." /></label>
          <button className="btn btn-solid" type="submit">Add video link</button>
        </form>

        <div className="admin-list">
          <h3>Current choir videos</h3>
          {(choir.videos || []).map((v) => (
            <div className="admin-list__row" key={v.id}>
              <div>
                <strong>{v.title}</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>{v.youtubeUrl}</p>
              </div>
              <button className="admin-delete" onClick={() => deleteChoirVideo(v.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Leadership ---------------- */
function LeadershipAdmin() {
  const { data, addLeader, deleteLeader } = useApp();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !role) return;
    addLeader({
      name,
      role,
      bio,
      photo: photo.trim() || "https://picsum.photos/seed/" + Math.floor(Math.random() * 1000) + "/300/300",
      photoDesc: photoDesc.trim() || `${name} - passport photo`
    });
    setName("");
    setRole("");
    setBio("");
    setPhoto("");
    setPhotoDesc("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add leader</h3>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Role<input value={role} onChange={(e) => setRole(e.target.value)} required /></label>
        <label>Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} /></label>
        <label>Passport Photo URL (Optional)<input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://example.com/photo.jpg" /></label>
        <label>Photo Description (Optional)<input value={photoDesc} onChange={(e) => setPhotoDesc(e.target.value)} placeholder="e.g. Elder James in a suit, smiling" /></label>
        <button className="btn btn-solid" type="submit">Add leader</button>
      </form>

      <div className="admin-list">
        <h3>Current leadership</h3>
        {data.leadership.map((l) => (
          <div className="admin-list__row" key={l.id}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {l.photo && <img src={l.photo} alt={l.photoDesc} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />}
              <div>
                <strong>{l.name}</strong> — {l.role}
                <p>{l.bio}</p>
                {l.photoDesc && <small style={{ color: "var(--ink-soft)" }}>Photo: {l.photoDesc}</small>}
              </div>
            </div>
            <button className="admin-delete" onClick={() => deleteLeader(l.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Sermons ---------------- */
function SermonsAdmin() {
  const { data, addSermon, deleteSermon } = useApp();
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [scripture, setScripture] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !speaker || !youtubeUrl) return;
    addSermon({
      title,
      speaker,
      date: date || new Date().toISOString().slice(0, 10),
      scripture,
      youtubeUrl,
      description
    });
    setTitle("");
    setSpeaker("");
    setDate("");
    setScripture("");
    setYoutubeUrl("");
    setDescription("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add sermon</h3>
        <label>Sermon Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label>Speaker Name<input value={speaker} onChange={(e) => setSpeaker(e.target.value)} required /></label>
        <label>Scripture Reference<input value={scripture} onChange={(e) => setScripture(e.target.value)} placeholder="e.g. Titus 2:11-13" /></label>
        <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>YouTube URL<input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required placeholder="https://www.youtube.com/watch?v=..." /></label>
        <label>Sermon Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></label>
        <button className="btn btn-solid" type="submit">Add sermon</button>
      </form>

      <div className="admin-list">
        <h3>Current sermons</h3>
        {(data.sermons || []).map((s) => (
          <div className="admin-list__row" key={s.id}>
            <div>
              <strong>{s.title}</strong>
              <p style={{ fontSize: "0.9rem", margin: "0.2rem 0" }}>Speaker: {s.speaker} · Scripture: {s.scripture || "N/A"} · Date: {s.date}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>{s.description}</p>
            </div>
            <button className="admin-delete" onClick={() => deleteSermon(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Missions ---------------- */
function MissionsAdmin() {
  const { data, addMission, deleteMission } = useApp();
  const [category, setCategory] = useState("upcoming");
  const [form, setForm] = useState({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.summary) return;
    const mission = {
      title: form.title,
      year: form.year || new Date().getFullYear().toString(),
      summary: form.summary,
    };
    if (category === "upcoming") {
      mission.goalKes = Number(form.goalKes) || 0;
      mission.raisedKes = Number(form.raisedKes) || 0;
    }
    addMission(category, mission);
    setForm({ title: "", year: "", summary: "", goalKes: "", raisedKes: "" });
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add mission</h3>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </label>
        <label>Title<input value={form.title} onChange={update("title")} required /></label>
        <label>Year<input value={form.year} onChange={update("year")} placeholder={new Date().getFullYear().toString()} /></label>
        <label>Summary<textarea value={form.summary} onChange={update("summary")} rows={3} required /></label>
        {category === "upcoming" && (
          <>
            <label>Goal (KES)<input type="number" value={form.goalKes} onChange={update("goalKes")} placeholder="e.g. 350000" /></label>
            <label>Raised so far (KES)<input type="number" value={form.raisedKes} onChange={update("raisedKes")} placeholder="e.g. 50000" /></label>
          </>
        )}
        <button className="btn btn-solid" type="submit">Add mission</button>
      </form>

      <div className="admin-list">
        {["upcoming", "past"].map((kind) => (
          <div key={kind}>
            <h3 style={{ textTransform: "capitalize" }}>{kind} missions</h3>
            {(data.missions[kind] || []).map((m) => (
              <div className="admin-list__row" key={m.id}>
                <div>
                  <strong>{m.title}</strong> <span className="admin-list__meta">({m.year})</span>
                  <p>{m.summary}</p>
                  {kind === "upcoming" && m.goalKes > 0 && (
                    <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                      KES {(m.raisedKes || 0).toLocaleString()} / {m.goalKes.toLocaleString()} raised
                    </p>
                  )}
                </div>
                <button className="admin-delete" onClick={() => deleteMission(kind, m.id)}>Delete</button>
              </div>
            ))}
            {(!data.missions[kind] || data.missions[kind].length === 0) && (
              <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>No {kind} missions yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
