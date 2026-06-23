import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./AnnouncementCard.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AnnouncementCard({ announcement }) {
  const { likeAnnouncement } = useApp();
  const [justLiked, setJustLiked] = useState(false);

  const handleLike = () => {
    likeAnnouncement(announcement.id);
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 400);
  };

  return (
    <article className="announcement-card">
      <p className="announcement-card__date">{formatDate(announcement.date)}</p>
      <h3 className="announcement-card__title">{announcement.title}</h3>
      <p className="announcement-card__body">{announcement.body}</p>
      <button
        className={`announcement-card__like ${justLiked ? "is-liked" : ""}`}
        onClick={handleLike}
        aria-label={`Like this announcement, ${announcement.likes} likes so far`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={justLiked ? "var(--clay)" : "none"} stroke="var(--clay)" strokeWidth="2">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
        <span>{announcement.likes}</span>
      </button>
    </article>
  );
}
