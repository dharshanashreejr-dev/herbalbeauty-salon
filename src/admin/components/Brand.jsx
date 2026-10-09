export default function Brand({ light = false, size = 'md' }) {
  return (
    <div className={`brand brand-${size} ${light ? 'brand-light' : ''}`}>
      <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#f6ece4' : '#1f3a2e'} />
        <path d="M32 14c6 6 9 11 9 16a9 9 0 0 1-18 0c0-5 3-10 9-16z" fill="#e8c9c1" />
        <path d="M32 50c-8-3-14-9-14-16 6 0 11 2 14 6 3-4 8-6 14-6 0 7-6 13-14 16z" fill="#a9bba5" />
      </svg>
      <div>
        <strong>The Velvet Touch</strong>
        <span>Beauty Salon admin</span>
      </div>
    </div>
  );
}
