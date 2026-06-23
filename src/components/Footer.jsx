import { useApp } from "../context/AppContext";
import "./Footer.css";

export default function Footer() {
  const { data } = useApp();
  const { contact } = data;

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">KARUSDA</div>
          <p className="footer__tagline">
            Karatina University Seventh-day Adventist Church — worshipping,
            serving, and sending, one Sabbath at a time.
          </p>
        </div>

        <div>
          <p className="eyebrow footer__heading">Find us</p>
          <p className="footer__line">{contact.address}</p>
          <p className="footer__line">
            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          </p>
          <p className="footer__line">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>

        <div>
          <p className="eyebrow footer__heading">Sabbath hours</p>
          <p className="footer__line">Saturdays, 7:00 AM – 5:00 PM</p>
          <p className="footer__line">Friday vespers from 5:00 PM</p>
        </div>

        <div>
          <p className="eyebrow footer__heading">Follow along</p>
          <p className="footer__line">{contact.facebook}</p>
          <p className="footer__line">{contact.instagram}</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} KARUSDA. Built in faith, by the community.</span>
      </div>
    </footer>
  );
}
