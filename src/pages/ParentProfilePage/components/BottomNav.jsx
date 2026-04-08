import "./BottomNav.css";
const NAV_ITEMS = [
  {
    id: "snapshot",
    label: "Snapshot",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3"  y="3"  width="7" height="7" />
        <rect x="14" y="3"  width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3"  y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Progress",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "practice",
    label: "Practice",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2"  x2="16" y2="6" />
        <line x1="8"  y1="2"  x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "detailed",
    label: "Detailed",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "exams",
    label: "Exams",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div className="pd-bottom-nav">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`pd-nav-item${active === item.id ? " pd-nav-item--active" : ""}`}
          onClick={() => onChange(item.id)}
          role="button"
          aria-label={item.label}
        >
          <div className="pd-nav-icon">{item.icon}</div>
          <div className="pd-nav-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
