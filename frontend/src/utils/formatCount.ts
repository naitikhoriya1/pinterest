/**
 * Formats numeric counters for compact UI display.
 * Below 1000 as-is, then 1.2k, 15k, 1.1M.
 */
export function formatCount(n: number | undefined | null): string {
  if (typeof n !== "number" || isNaN(n) || n <= 0) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return k >= 10 ? `${Math.floor(k)}k` : `${parseFloat(k.toFixed(1))}k`;
  }
  const m = n / 1_000_000;
  return `${parseFloat(m.toFixed(1))}M`;
}

/**
 * Returns a human-readable relative time string:
 * "just now", "5m ago", "3h ago", "2d ago"
 */
export function timeAgo(iso: string | Date | undefined | null): string {
  if (!iso) return "";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}
