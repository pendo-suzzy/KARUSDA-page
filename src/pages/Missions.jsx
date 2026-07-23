import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Missions.css";

export default function Missions() {
  const { data } = useApp();
  const { missions = { past: [], upcoming: [] }, contact = {} } = data;
  const [form, setForm] = useState({ name: "", amount: "", mission: missions.upcoming[0]?.title || "", method: "MPESA" });
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(`Thank you ${form.name || "friend"}! Your pledge of KES ${form.amount || 0} for ${form.mission} is recorded.`);
    setForm((current) => ({ ...current, name: "", amount: "" }));
  };

  return (
    <div className="missions-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Mission in action</p>
          <h1 className="page-hero__title">Our outreach and mission stories</h1>
          <p className="page-hero__sub">
            KARUSDA serves beyond the campus walls through literature evangelism, health outreach, and compassionate care.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Upcoming initiatives</h2>
          <div className="mission-grid">
            {missions.upcoming?.map((mission) => (
              <article key={mission.id} className="mission-card">
                <div className="mission-card__year">{mission.year}</div>
                <h3>{mission.title}</h3>
                <p>{mission.summary}</p>
                {typeof mission.goalKes === "number" && (
                  <>
                    <div className="mission-card__bar">
                      <div className="mission-card__bar-fill" style={{ width: `${Math.min(100, (mission.raisedKes / mission.goalKes) * 100)}%` }} />
                    </div>
                    <div className="mission-card__figures">
                      <span>Raised: KES {mission.raisedKes}</span>
                      <span>Goal: KES {mission.goalKes}</span>
                    </div>
                  </>
                )}
                {mission.documentUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <a href={mission.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                      📄 Read Document
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Mission timeline</h2>
          <ul className="mission-timeline">
            {missions.past?.map((mission) => (
              <li key={mission.id} className="mission-timeline__item">
                <div className="mission-timeline__year">{mission.year}</div>
                <div>
                  <h3>{mission.title}</h3>
                  <p>{mission.summary}</p>
                  {mission.documentUrl && (
                    <a href={mission.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                      📄 Read Document
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section contribute">
        <div className="container contribute__row">
          <div>
            <p className="eyebrow">Partner with us</p>
            <h2 className="section__title" style={{ color: "var(--paper)" }}>Support the next mission project</h2>
            <p className="contribute__copy">
              Your gift helps us reach students, families, and communities with the message of hope. We also welcome prayer partners and volunteers.
            </p>
            <p className="contribute__copy">Email: {contact.email}</p>
          </div>

          <form className="contribute__form" onSubmit={handleSubmit}>
            <label>
              Your name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jane Doe" />
            </label>
            <label>
              Amount (KES)
              <input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="5000" />
            </label>
            <label>
              Mission project
              <select value={form.mission} onChange={(event) => setForm({ ...form, mission: event.target.value })}>
                {missions.upcoming?.map((mission) => (
                  <option key={mission.id} value={mission.title}>{mission.title}</option>
                ))}
              </select>
            </label>
            <label>
              Payment method
              <select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}>
                <option value="MPESA">MPESA</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </label>
            <button className="footer__submit-btn" type="submit">Record my pledge</button>
            {status && <p className="contribute__status">{status}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}
