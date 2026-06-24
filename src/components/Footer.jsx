import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Footer.css";

/* Inline SVG icons — lightweight, no extra dependency */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__icon-svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer__icon-svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="footer__icon-svg">
    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.386.52A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.112 2.12c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.994 2.994 0 0 0 2.112-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__icon-svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer__icon-svg footer__icon-svg--small">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CHURCH_EMAIL = "karatinauniversitysdachurch@gmail.com";

export default function Footer() {
  const { data } = useApp();
  const { contact } = data;

  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [formType, setFormType] = useState("prayer"); // "prayer" or "message"
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectPrefix = formType === "prayer" ? "Prayer Request" : "Message";
    const subject = formData.subject
      ? `${subjectPrefix}: ${formData.subject}`
      : `${subjectPrefix} from ${formData.name || "Website Visitor"}`;
    const body = `From: ${formData.name || "Anonymous"}\n\n${formData.message}`;
    const mailtoLink = `mailto:${CHURCH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
    setSent(true);
    setFormData({ name: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        {/* Brand & Tagline */}
        <div className="footer__col">
          <div className="footer__brand">KARUSDA</div>
          <p className="footer__tagline">
            Karatina University Seventh-day Adventist Church — worshipping,
            serving, and sending, one Sabbath at a time.
          </p>
          {/* Social icons */}
          <div className="footer__socials">
            <a
              href="https://www.instagram.com/karusda_2025?igsh=NHg5YmF6ejF3emg0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              title="Follow us on Instagram"
              className="footer__social-link footer__social-link--instagram"
            >
              <IconInstagram />
            </a>
            <a
              href="https://www.facebook.com/karusda.main?mibextid=rS40aB7S9Ucbxw6v"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              title="Follow us on Facebook"
              className="footer__social-link footer__social-link--facebook"
            >
              <IconFacebook />
            </a>
            <a
              href="https://www.youtube.com/@UCmFWvxiBFvwYkJbsQ8zdMXg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe on YouTube"
              title="Subscribe on YouTube"
              className="footer__social-link footer__social-link--youtube"
            >
              <IconYouTube />
            </a>
          </div>
        </div>

        {/* Find Us */}
        <div className="footer__col">
          <p className="eyebrow footer__heading">Find us</p>
          <p className="footer__line footer__line--icon">
            <IconMapPin />
            <span>{contact.address}</span>
          </p>
          <p className="footer__line footer__line--icon">
            <IconMail />
            <a href={`mailto:${CHURCH_EMAIL}`}>{CHURCH_EMAIL}</a>
          </p>

          <p className="eyebrow footer__heading" style={{ marginTop: "1.2rem" }}>Sabbath hours</p>
          <p className="footer__line">Saturdays, 7:00 AM – 5:00 PM</p>
          <p className="footer__line">Friday vespers from 5:00 PM</p>
        </div>

        {/* Prayer Request / Message Form */}
        <div className="footer__col footer__col--form">
          <p className="eyebrow footer__heading">Send us a message</p>
          <div className="footer__form-toggle">
            <button
              type="button"
              className={`footer__toggle-btn ${formType === "prayer" ? "footer__toggle-btn--active" : ""}`}
              onClick={() => setFormType("prayer")}
            >
              🙏 Prayer Request
            </button>
            <button
              type="button"
              className={`footer__toggle-btn ${formType === "message" ? "footer__toggle-btn--active" : ""}`}
              onClick={() => setFormType("message")}
            >
              ✉️ Message
            </button>
          </div>

          {sent && (
            <div className="footer__sent-msg">
              ✅ Your email client should open with the {formType === "prayer" ? "prayer request" : "message"} ready to send!
            </div>
          )}

          <form className="footer__form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="footer__input"
            />
            <input
              type="text"
              name="subject"
              placeholder={formType === "prayer" ? "Prayer topic (optional)" : "Subject (optional)"}
              value={formData.subject}
              onChange={handleChange}
              className="footer__input"
            />
            <textarea
              name="message"
              placeholder={formType === "prayer" ? "Share your prayer request…" : "Write your message…"}
              value={formData.message}
              onChange={handleChange}
              className="footer__textarea"
              rows={3}
              required
            />
            <button type="submit" className="footer__submit-btn">
              {formType === "prayer" ? "Send Prayer Request" : "Send Message"}
            </button>
            <p className="footer__form-note">
              Opens your email app to send to <strong>{CHURCH_EMAIL}</strong>
            </p>
          </form>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} KARUSDA. Built in faith, by the community.</span>
      </div>
    </footer>
  );
}
