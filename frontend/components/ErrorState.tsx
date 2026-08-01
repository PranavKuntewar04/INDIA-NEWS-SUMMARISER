interface ErrorStateProps {
  isDark: boolean;
  onRetry: () => void;
}

export default function ErrorState({ isDark, onRetry }: ErrorStateProps) {
  return (
    <div
      id="error-state"
      className="flex flex-col items-center justify-center py-16 rounded-2xl border text-center"
      style={{
        backgroundColor: isDark
          ? "rgba(186, 26, 26, 0.08)"
          : "rgba(255, 218, 214, 0.2)",
        borderColor: isDark
          ? "rgba(186, 26, 26, 0.3)"
          : "var(--color-error-container)",
      }}
    >
      {/* Error Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: isDark
            ? "rgba(186, 26, 26, 0.15)"
            : "var(--color-error-container)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-error)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Heading */}
      <h3
        className="text-xl font-semibold mb-2"
        style={{
          fontFamily: "var(--font-display)",
          lineHeight: "28px",
          color: isDark
            ? "var(--color-on-primary)"
            : "var(--color-on-surface)",
        }}
      >
        Unable to load briefings
      </h3>

      {/* Message */}
      <p
        className="text-base mb-6 max-w-md"
        style={{
          fontFamily: "var(--font-body)",
          lineHeight: "24px",
          color: isDark
            ? "var(--color-outline-variant)"
            : "var(--color-on-surface-variant)",
        }}
      >
        Please check your connection and try again. The backend API may not be
        running.
      </p>

      {/* Retry Button */}
      <button
        id="retry-button"
        onClick={onRetry}
        className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-on-primary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            "var(--color-primary-container)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        Retry
      </button>
    </div>
  );
}
