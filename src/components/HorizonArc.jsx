// The recurring divider used between sections across the whole site.
// It's a simple arc — a horizon line — that nods to the Sabbath Horizon
// widget on the homepage. `tone` flips it for light or dark sections.
export default function HorizonArc({ tone = "cream", flip = false }) {
  const strokeColor = tone === "dark" ? "#c9962e" : "#1c1810";
  const fillColor = tone === "dark" ? "#1c1810" : "#f6f1e4";

  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "44px", display: "block" }}
      >
        <path
          d="M0,40 Q600,-20 1200,40 L1200,60 L0,60 Z"
          fill={fillColor}
        />
        <path
          d="M0,40 Q600,-20 1200,40"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
