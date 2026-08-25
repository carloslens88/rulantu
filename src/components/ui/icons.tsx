type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21l1.5-4.7A8.5 8.5 0 1 1 8.6 19.4L3 21Z" />
      <path
        d="M8.7 8.9c-.2.9.1 2 .9 3.1 1 1.3 2.1 2 3.2 2.3.5.1 1-.1 1.2-.5l.3-.6c.1-.3 0-.6-.2-.7l-1.3-.9a.5.5 0 0 0-.6.1l-.3.4a4 4 0 0 1-1.7-1.9l.3-.3a.5.5 0 0 0 .1-.6l-.7-1.4a.6.6 0 0 0-.7-.3l-.5.2Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}
