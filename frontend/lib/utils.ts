/**
 * Format a timestamp as a human-readable relative time string.
 * e.g. "2 minutes ago", "3 hours ago", "yesterday"
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const absDiffMs = Math.abs(diffMs);
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (absDiffMs < 60 * 1000) {
    return "just now";
  } else if (absDiffMs < 60 * 60 * 1000) {
    return rtf.format(minutes, "minute");
  } else if (absDiffMs < 24 * 60 * 60 * 1000) {
    return rtf.format(hours, "hour");
  } else {
    return rtf.format(days, "day");
  }
}

/**
 * Format "Updated X ago" for the header timestamp.
 */
export function getUpdatedTimeText(dateString: string | null): string {
  if (!dateString) return "Updating…";

  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.round(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffMinutes < 1) return "Updated just now";
  if (diffMinutes === 1) return "Updated 1m ago";
  if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours === 1) return "Updated 1h ago";
  if (diffHours < 24) return `Updated ${diffHours}h ago`;

  return `Updated ${Math.round(diffHours / 24)}d ago`;
}
