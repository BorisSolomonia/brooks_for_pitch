import '../styles/FAB.css';

interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FAB({ onClick, label = 'Leave a Mark' }: FABProps) {
  return (
    <button className="fab" onClick={onClick} aria-label={label}>
      <svg
        className="fab-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span className="fab-label">{label}</span>
    </button>
  );
}
