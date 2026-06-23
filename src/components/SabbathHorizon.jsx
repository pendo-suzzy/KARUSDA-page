import "./SabbathHorizon.css";

const WEEK = [
  { day: "Sun", label: "Choir practice", time: "2:00 PM" },
  { day: "Mon", label: "Ministries meet", time: "5:30 PM" },
  { day: "Tue", label: "AMO & ALO", time: "5:30 PM" },
  { day: "Wed", label: "Vespers", time: "5:30 PM" },
  { day: "Thu", label: "Choir practice", time: "5:00 PM" },
  { day: "Fri", label: "Vespers — sun goes down", time: "5:00 PM", sabbath: true },
  { day: "Sat", label: "Sabbath worship", time: "7 AM – 5 PM", sabbath: true },
];

const W = 1200;
const BASE_Y = 150;
const PEAK_Y = 50;

// Quadratic bezier P0=(0,BASE_Y) P1=(600,PEAK_Y) P2=(1200,BASE_Y)
function curveY(t) {
  return (1 - t) ** 2 * BASE_Y + 2 * (1 - t) * t * PEAK_Y + t ** 2 * BASE_Y;
}

function buildPath(tStart, tEnd, steps = 40) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = tStart + (tEnd - tStart) * (i / steps);
    const x = t * W;
    const y = curveY(t);
    d += i === 0 ? `M${x},${y} ` : `L${x},${y} `;
  }
  return d;
}

export default function SabbathHorizon() {
  const fullPath = buildPath(0, 1);
  const sabbathPath = buildPath(5 / 6, 1);

  return (
    <div className="sabbath-horizon">
      <p className="eyebrow">The week, at a glance</p>
      <h3 className="sabbath-horizon__title">
        Our rhythm rises toward the Sabbath
      </h3>
      <div className="sabbath-horizon__scroll">
        <svg viewBox={`0 -10 ${W} 230`} className="sabbath-horizon__svg" role="img"
          aria-label="Weekly schedule from Sunday choir practice through Saturday Sabbath worship">
          <path d={fullPath} fill="none" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="2" />
          <path d={sabbathPath} fill="none" stroke="var(--gold)" strokeWidth="5" strokeLinecap="round" />

          {WEEK.map((item, i) => {
            const t = i / 6;
            const x = t * W;
            const y = curveY(t);
            return (
              <g key={item.day}>
                <circle
                  cx={x}
                  cy={y}
                  r={item.sabbath ? 9 : 6}
                  fill={item.sabbath ? "var(--gold)" : "var(--paper)"}
                  stroke={item.sabbath ? "var(--ink)" : "var(--ink)"}
                  strokeWidth="2"
                />
                <text x={x} y={y - 22} textAnchor="middle" className="sh-label">
                  {item.label}
                </text>
                <text x={x} y={y - 6} textAnchor="middle" className="sh-time">
                  {item.time}
                </text>
                <text x={x} y={y + 28} textAnchor="middle" className="sh-day">
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="sabbath-horizon__caption">
        The gold arc marks the Sabbath — from Friday vespers as the sun sets, to the close of worship Saturday evening.
      </p>
    </div>
  );
}
