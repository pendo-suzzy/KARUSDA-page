import { useState, useEffect, useRef, useCallback } from "react";
import "./HeroSlider.css";

const SLIDES = [
  {
    type: "image",
    src: "/hero-1.jpg",
    alt: "KARUSDA church image 1",
    caption: "Worshipping together, every Sabbath",
  },
  {
    type: "image",
    src: "/hero-2.jpg",
    alt: "KARUSDA church image 2",
    caption: "The heavens declare the glory of God",
  },
  {
    type: "image",
    src: "/hero-3.jpg",
    alt: "The Three Angels — God's message to the world",
    caption: "Fear God and give Him glory",
  },
  {
    type: "image",
    src: "/hero-bg.jpg",
    alt: "KARUSDA church gathering in the evening",
    caption: "Come as you are — rest is sacred here",
  },
];

const INTERVAL = 7000;

export default function HeroSlider({ children }) {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState("next"); // "next" | "prev"
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const goTo = useCallback((idx, dir = "next") => {
    setAnimDir(dir);
    setActive(idx);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % SLIDES.length, "next");
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [active, goTo]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Reset timer on manual navigation
  const manualGoTo = (idx, dir) => {
    clearInterval(timerRef.current);
    goTo(idx, dir);
    timerRef.current = setInterval(next, INTERVAL);
  };

  // Mute & play video when it becomes active
  useEffect(() => {
    if (SLIDES[active].type === "video" && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  return (
    <div className="hero-slider">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hero-slider__slide ${i === active ? "is-active" : ""} ${
            i === active ? `slide-in-${animDir}` : ""
          }`}
          aria-hidden={i !== active}
        >
          {slide.type === "image" ? (
            <img
              src={slide.src}
              alt={slide.alt}
              className="hero-slider__media"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ) : (
            <video
              ref={videoRef}
              className="hero-slider__media"
              src={slide.src}
              poster={slide.poster}
              muted
              autoPlay={i === active}
              loop
              playsInline
            />
          )}
          <div className="hero-slider__overlay" />
        </div>
      ))}

      {/* Hero content (passed as children) */}
      <div className="hero-slider__content">{children}</div>

      {/* Slide caption */}
      <div className="hero-slider__caption">
        {SLIDES[active].caption}
      </div>

      {/* Arrow controls */}
      <button
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={() => manualGoTo((active - 1 + SLIDES.length) % SLIDES.length, "prev")}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={() => manualGoTo((active + 1) % SLIDES.length, "next")}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="hero-slider__dots">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            className={`hero-slider__dot ${i === active ? "is-active" : ""}`}
            onClick={() => manualGoTo(i, i > active ? "next" : "prev")}
            aria-label={`Go to slide ${i + 1}${slide.type === "video" ? " (video)" : ""}`}
          >
            {slide.type === "video" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="hero-slider__dot-icon">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="hero-slider__progress">
        <div key={active} className="hero-slider__progress-fill" />
      </div>
    </div>
  );
}
