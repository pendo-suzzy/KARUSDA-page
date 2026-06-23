import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Admin.css";

const TABS = ["Announcements", "Events", "Gallery", "Ministries", "Choir", "Leadership"];

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
            <p className="admin-login__hint">Demo credentials: admin / karusda2026</p>
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
  const { data, updateChoir } = useApp();
  const { choir } = data;

  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        updateChoir({
          members: Number(fd.get("members")),
          leadName: fd.get("leadName"),
          description: fd.get("description"),
        });
      }}
    >
      <h3>Edit choir details</h3>
      <label>Number of vocalists<input name="members" type="number" defaultValue={choir.members} /></label>
      <label>Choir lead<input name="leadName" defaultValue={choir.leadName} /></label>
      <label>Description<textarea name="description" defaultValue={choir.description} rows={3} /></label>
      <button className="btn btn-solid" type="submit">Save choir details</button>
    </form>
  );
}

/* ---------------- Leadership ---------------- */
function LeadershipAdmin() {
  const { data, addLeader, deleteLeader } = useApp();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !role) return;
    addLeader({ name, role, bio });
    setName("");
    setRole("");
    setBio("");
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add leader</h3>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Role<input value={role} onChange={(e) => setRole(e.target.value)} required /></label>
        <label>Bio<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} /></label>
        <button className="btn btn-solid" type="submit">Add leader</button>
      </form>

      <div className="admin-list">
        {data.leadership.map((l) => (
          <div className="admin-list__row" key={l.id}>
            <div>
              <strong>{l.name}</strong> — {l.role}
              <p>{l.bio}</p>
            </div>
            <button className="admin-delete" onClick={() => deleteLeader(l.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
