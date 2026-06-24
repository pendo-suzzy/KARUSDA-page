import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useApp } from "../context/AppContext";
import "./Footer.css";

// ── EmailJS credentials (set in .env file) ──────────────────────────────────
const EJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";
const EJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
const EJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const CHURCH_EMAIL    = "karatinauniversitysdachurch@gmail.com";

// ── Check whether EmailJS is configured ─────────────────────────────────────
const EJS_READY = EJS_PUBLIC_KEY && EJS_SERVICE_ID && EJS_TEMPLATE_ID
  && !EJS_PUBLIC_KEY.includes("YOUR_");

/* ── Inline SVG icons ─────────────────────────────────────────────────────── */
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

/* ── Footer component ─────────────────────────────────────────────────────── */
export default function Footer() {
  const { data } = useApp();
  const { contact } = data;
  const formRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [formType, setFormType] = useState("prayer");
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const subjectPrefix = formType === "prayer" ? "🙏 Prayer Request" : "✉️ Message";
    const subject = formData.subject
      ? `${subjectPrefix}: ${formData.subject}`
      : `${subjectPrefix} from ${formData.name || "Website Visitor"}`;

    // ── If EmailJS is configured, send directly ──────────────────────────
    if (EJS_READY) {
      try {
        await emailjs.send(
          EJS_SERVICE_ID,
          EJS_TEMPLATE_ID,
          {
            from_name:    formData.name || "Anonymous",
            subject_line: subject,
            message:      formData.message,
            form_type:    formType === "prayer" ? "Prayer Request" : "General Message",
            reply_to:     CHURCH_EMAIL,
            to_email:     CHURCH_EMAIL,
          },
          EJS_PUBLIC_KEY
        );
        setStatus("success");
        setFormData({ name: "", subject: "", message: "" });
        setTimeout(() => setStatus(null), 6000);
      } catch (err) {
        console.error("EmailJS error:", err);
        setStatus("error");
        setTimeout(() => setStatus(null), 6000);
      }
    } else {
      // ── Fallback: open user's email client ─────────────────────────────
      const body = `From: ${formData.name || "Anonymous"}\n\n${formData.message}`;
      const mailtoLink = `mailto:${CHURCH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      setStatus("mailto");
      setFormData({ name: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    }
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
          <div className="footer__socials">
            <a href="https://www.instagram.com/karusda_2025?igsh=NHg5YmF6ejF3emg0" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" title="Follow us on Instagram" className="footer__social-link footer__social-link--instagram">
              <IconInstagram />
            </a>
            <a href="https://www.facebook.com/karusda.main?mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" title="Follow us on Facebook" className="footer__social-link footer__social-link--facebook">
              <IconFacebook />
            </a>
            <a href="https://www.youtube.com/@UCmFWvxiBFvwYkJbsQ8zdMXg" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" title="Subscribe on YouTube" className="footer__social-link footer__social-link--youtube">
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

        {/* Form */}
        <div className="footer__col footer__col--form">
          <p className="eyebrow footer__heading">Send us a message</p>

          {/* Toggle */}
          <div className="footer__form-toggle">
            <button type="button" className={`footer__toggle-btn ${formType === "prayer" ? "footer__toggle-btn--active" : ""}`} onClick={() => setFormType("prayer")}>
              🙏 Prayer Request
            </button>
            <button type="button" className={`footer__toggle-btn ${formType === "message" ? "footer__toggle-btn--active" : ""}`} onClick={() => setFormType("message")}>
              ✉️ Message
            </button>
          </div>

          {/* Status feedback */}
          {status === "success" && (
            <div className="footer__status footer__status--success">
              ✅ {formType === "prayer" ? "Prayer request" : "Message"} sent to the church! We'll be in touch.
            </div>
          )}
          {status === "sending" && (
            <div className="footer__status footer__status--sending">
              ⏳ Sending…
            </div>
          )}
          {status === "error" && (
            <div className="footer__status footer__status--error">
              ❌ Something went wrong. Please email us directly at <strong>{CHURCH_EMAIL}</strong>
            </div>
          )}
          {status === "mailto" && (
            <div className="footer__status footer__status--success">
              ✅ Your email client should now open with the message ready to send!
            </div>
          )}

          <form ref={formRef} className="footer__form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="footer__input"
              disabled={status === "sending"}
            />
            <input
              type="text"
              name="subject"
              placeholder={formType === "prayer" ? "Prayer topic (optional)" : "Subject (optional)"}
              value={formData.subject}
              onChange={handleChange}
              className="footer__input"
              disabled={status === "sending"}
            />
            <textarea
              name="message"
              placeholder={formType === "prayer" ? "Share your prayer request…" : "Write your message…"}
              value={formData.message}
              onChange={handleChange}
              className="footer__textarea"
              rows={3}
              required
              disabled={status === "sending"}
            />
            <button
              type="submit"
              className="footer__submit-btn"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Sending…"
                : formType === "prayer"
                ? "Send Prayer Request"
                : "Send Message"}
            </button>
            {!EJS_READY && (
              <p className="footer__form-note">
                ⚠️ EmailJS not configured yet — will open your email client as fallback.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} KARUSDA. Built in faith, by the community.</span>
      </div>
    </footer>
  );
}
