import { useState } from "react";
import { useApp } from "../context/AppContext";
import HorizonArc from "../components/HorizonArc";
import "./Missions.css";

export default function Missions() {
  const { data, contributeToMission } = useApp();
  const { past, upcoming } = data.missions;
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id || "");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!selectedId || !value || value <= 0) return;
    contributeToMission(selectedId, value);
    setStatus(`Thank you, ${name || "friend"} — your pledge of KES ${value.toLocaleString()} has been recorded.`);
    setName("");
    setAmount("");
  };

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Missions</p>
          <h1 className="page-hero__title">Sent beyond these walls</h1>
          <p className="page-hero__sub">
            A record of where we've gone, where we're headed next, and how
            you can be part of it.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Where we're headed</p>
          <h2 className="section__title">Upcoming missions</h2>
          <div className="mission-grid">
            {upcoming.map((m) => {
              const pct = Math.min(100, Math.round((m.raisedKes / m.goalKes) * 100));
              return (
                <article className="mission-card" key={m.id}>
                  <span className="mission-card__year">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.summary}</p>
                  <div className="mission-card__bar">
                    <div className="mission-card__bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mission-card__figures">
                    <span>KES {m.raisedKes.toLocaleString()} raised</span>
                    <span>{pct}% of KES {m.goalKes.toLocaleString()}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <HorizonArc tone="cream" />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Where we've been</p>
          <h2 className="section__title">Past missions</h2>
          <ol className="mission-timeline">
            {past.map((m) => (
              <li key={m.id} className="mission-timeline__item">
                <span className="mission-timeline__year">{m.year}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HorizonArc tone="dark" />

      <section className="section contribute">
        <div className="container contribute__row">
          <div>
            <p className="eyebrow" style={{ color: "var(--gold-soft)" }}>Give toward the next mission</p>
            <h2 className="section__title" style={{ color: "var(--paper)" }}>
              Contribute
            </h2>
            <p className="contribute__copy">
              Choose a mission and record a pledge. This demo logs your
              contribution to the mission's running total — connect it to a
              real payment provider (M-Pesa, card) when you're ready to go live.
            </p>
          </div>

          <form className="contribute__form" onSubmit={handleSubmit}>
            <label>
              Mission
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {upcoming.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </label>
            <label>
              Your name (optional)
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wambui" />
            </label>
            <label>
              Amount (KES)
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                required
              />
            </label>
            <button type="submit" className="btn btn-solid">Record contribution</button>
            {status && <p className="contribute__status">{status}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
