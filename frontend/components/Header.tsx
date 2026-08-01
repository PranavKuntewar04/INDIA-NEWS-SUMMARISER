"use client";

import { NAV_FILTERS, type NavFilterValue } from "@/lib/types";

interface HeaderProps {
  updatedText: string;
  isRefreshing: boolean;
  activeFilter: NavFilterValue;
  onFilterChange: (filter: NavFilterValue) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  updatedText,
  isRefreshing,
  activeFilter,
  onFilterChange,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header
      id="main-header"
      className="fixed top-0 w-full z-50 glass-header border-b shadow-sm"
      style={{
        backgroundColor: isDark
          ? "rgba(42, 49, 61, 0.9)"
          : "rgba(249, 249, 255, 0.8)",
        borderColor: isDark
          ? "rgba(199, 196, 216, 0.2)"
          : "rgba(199, 196, 216, 0.5)",
      }}
    >
      <div className="flex justify-between items-center w-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-4 max-w-[var(--spacing-container-max)] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="India flag">
            🇮🇳
          </span>
          <h1
            className="gradient-text text-2xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            India News Briefing
          </h1>
        </div>

        {/* Nav Links (Desktop) */}
        <nav
          id="nav-filters"
          className="hidden md:flex gap-[var(--spacing-stack-lg)] items-center"
        >
          {NAV_FILTERS.map((item) => (
            <button
              key={item.value}
              id={`nav-filter-${item.value}`}
              onClick={() => onFilterChange(item.value)}
              className="text-sm font-medium transition-colors cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0.01em",
                color:
                  activeFilter === item.value
                    ? isDark
                      ? "var(--color-primary-fixed-dim)"
                      : "var(--color-primary)"
                    : isDark
                      ? "var(--color-outline-variant)"
                      : "var(--color-on-surface-variant)",
                borderBottom:
                  activeFilter === item.value
                    ? `2px solid ${isDark ? "var(--color-primary-fixed-dim)" : "var(--color-primary)"}`
                    : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Live Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: isDark
                ? "var(--color-inverse-surface)"
                : "rgba(42, 49, 61, 0.1)",
            }}
          >
            {isRefreshing ? (
              <svg
                className="w-3 h-3 animate-spin-slow"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="28"
                  strokeDashoffset="7"
                  className="text-primary"
                />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            )}
            <span
              className="text-xs font-semibold"
              style={{
                color: isDark
                  ? "var(--color-on-primary)"
                  : "var(--color-on-surface)",
              }}
            >
              {isRefreshing ? "Syncing" : "Live"}
            </span>
          </div>

          {/* Updated Time */}
          <div className="hidden sm:block text-right">
            <p
              id="last-updated"
              className="text-xs font-semibold"
              style={{
                color: isDark
                  ? "var(--color-outline-variant)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              {updatedText}
            </p>
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              color: isDark
                ? "var(--color-dark-text)"
                : "var(--color-on-surface)",
            }}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
