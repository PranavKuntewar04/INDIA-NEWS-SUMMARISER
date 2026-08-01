"use client";

import { type Category, CATEGORY_ICONS } from "@/lib/types";
import { getRelativeTime } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  isDark: boolean;
}

export default function CategoryCard({ category, isDark }: CategoryCardProps) {
  const icon = category.icon || CATEGORY_ICONS[category.name] || "📰";

  /* Use the first source's title as the headline, or fall back to the category name */
  const headline =
    category.sources.length > 0
      ? category.sources[0].title
      : `${category.name} Briefing`;

  /* Most recent source for the timestamp */
  const latestSource = category.sources.reduce<{
    source: string;
    url: string;
    publishedAt: string;
  } | null>((latest, src) => {
    if (!src.publishedAt) return latest;
    if (!latest || new Date(src.publishedAt) > new Date(latest.publishedAt)) {
      return {
        source: src.source,
        url: src.url,
        publishedAt: src.publishedAt,
      };
    }
    return latest;
  }, null);

  return (
    <article
      id={`card-${category.name.toLowerCase()}`}
      className="card-animate rounded-2xl p-6 flex flex-col h-full transition-all duration-300 border"
      style={{
        backgroundColor: isDark
          ? "var(--color-inverse-surface)"
          : "var(--color-surface-container-lowest)",
        borderColor: isDark
          ? "rgba(199, 196, 216, 0.15)"
          : "rgba(199, 196, 216, 0.3)",
        boxShadow: isDark
          ? "none"
          : "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 8px 30px rgba(0, 0, 0, 0.3)"
          : "0 8px 30px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isDark
          ? "none"
          : "0 4px 20px rgba(0, 0, 0, 0.05)";
      }}
    >
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl" role="img" aria-label={category.name}>
          {icon}
        </span>
        <span
          className="px-2 py-1 rounded text-xs font-semibold"
          style={{
            backgroundColor: isDark
              ? "var(--color-dark-surface)"
              : "var(--color-surface-variant)",
            color: isDark
              ? "var(--color-dark-text)"
              : "var(--color-on-surface-variant)",
          }}
        >
          {category.name}
        </span>
      </div>

      {/* Headline */}
      <h3
        className="text-xl font-semibold mb-4"
        style={{
          fontFamily: "var(--font-display)",
          lineHeight: "28px",
          color: isDark
            ? "var(--color-on-primary)"
            : "var(--color-on-surface)",
        }}
      >
        {headline}
      </h3>

      {/* Summary Points */}
      <ul className="space-y-3 mb-6 flex-grow">
        {category.summaryPoints.map((point, idx) => (
          <li key={idx} className="flex gap-2 items-start">
            <span
              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
            <span
              className="text-base"
              style={{
                fontFamily: "var(--font-body)",
                lineHeight: "24px",
                color: isDark
                  ? "var(--color-outline-variant)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              {point}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer: source + time */}
      <div
        className="flex justify-between items-center pt-4 mt-auto border-t"
        style={{
          borderColor: isDark
            ? "rgba(199, 196, 216, 0.15)"
            : "rgba(199, 196, 216, 0.3)",
        }}
      >
        {latestSource ? (
          <a
            href={latestSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{
              color: isDark
                ? "var(--color-secondary-fixed-dim)"
                : "var(--color-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = isDark
                ? "var(--color-secondary-fixed-dim)"
                : "var(--color-secondary)")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 8h16" />
              <path d="M8 4v4" />
            </svg>
            {latestSource.source}
          </a>
        ) : (
          <span
            className="text-xs font-semibold"
            style={{
              color: isDark
                ? "var(--color-secondary-fixed-dim)"
                : "var(--color-secondary)",
            }}
          >
            {category.sources.length} source
            {category.sources.length !== 1 ? "s" : ""}
          </span>
        )}
        <span
          className="text-xs font-semibold"
          style={{
            color: isDark
              ? "var(--color-outline-variant)"
              : "var(--color-outline)",
          }}
        >
          {latestSource?.publishedAt
            ? getRelativeTime(latestSource.publishedAt)
            : `${category.articleCount} articles`}
        </span>
      </div>
    </article>
  );
}
