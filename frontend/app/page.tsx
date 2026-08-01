"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorState from "@/components/ErrorState";
import { type NewsSummary, type NavFilterValue } from "@/lib/types";
import { getUpdatedTimeText } from "@/lib/utils";

/** Auto-refresh interval: 15 minutes */
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

/** Time display update interval: 1 minute */
const TIME_UPDATE_INTERVAL_MS = 60 * 1000;

type UIState = "loading" | "loaded" | "error" | "refreshing";

export default function HomePage() {
  /* ---- State ---- */
  const [uiState, setUiState] = useState<UIState>("loading");
  const [summary, setSummary] = useState<NewsSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [updatedText, setUpdatedText] = useState<string>("Updating…");
  const [activeFilter, setActiveFilter] = useState<NavFilterValue>("all");
  const [isDark, setIsDark] = useState<boolean>(true);

  const lastFetchTimeRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeUpdateTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  /* ---- Theme management ---- */
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else if (stored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      /* Default to dark */
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  /* ---- Data fetching ---- */
  const fetchLatestSummary = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh && summary) {
          setUiState("refreshing");
        } else {
          setUiState("loading");
        }
        setErrorMsg("");

        const res = await fetch("/api/summary/latest", {
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              "No summary available yet. The n8n pipeline may not have run."
            );
          }
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        const data: NewsSummary = await res.json();
        setSummary(data);
        lastFetchTimeRef.current = data.generatedAt || new Date().toISOString();
        setUpdatedText(getUpdatedTimeText(lastFetchTimeRef.current));
        setUiState("loaded");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setErrorMsg(message);
        /* On refresh failure, keep showing existing data if available */
        if (isRefresh && summary) {
          setUiState("loaded");
        } else {
          setUiState("error");
        }
      }
    },
    [summary]
  );

  /* ---- Initial fetch ---- */
  useEffect(() => {
    fetchLatestSummary(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Auto-refresh every 15 minutes ---- */
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      fetchLatestSummary(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fetchLatestSummary]);

  /* ---- Update "Updated X ago" text every minute ---- */
  useEffect(() => {
    timeUpdateTimerRef.current = setInterval(() => {
      if (lastFetchTimeRef.current) {
        setUpdatedText(getUpdatedTimeText(lastFetchTimeRef.current));
      }
    }, TIME_UPDATE_INTERVAL_MS);

    return () => {
      if (timeUpdateTimerRef.current) clearInterval(timeUpdateTimerRef.current);
    };
  }, []);

  /* ---- Filtered categories ---- */
  const filteredCategories =
    summary?.categories.filter((cat) => {
      if (activeFilter === "all") return true;
      return cat.name === activeFilter;
    }) ?? [];

  /* ---- Mobile nav filter (via select dropdown) ---- */
  const handleFilterChange = useCallback((filter: NavFilterValue) => {
    setActiveFilter(filter);
  }, []);

  /* ---- Render ---- */
  return (
    <>
      <Header
        updatedText={updatedText}
        isRefreshing={uiState === "refreshing"}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main
        id="main-content"
        className="flex-grow pt-[100px] pb-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto w-full"
      >
        {/* Welcome Section */}
        <section id="welcome-section" className="mb-[var(--spacing-stack-lg)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" role="img" aria-label="AI sparkle">
              ✨
            </span>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: isDark
                  ? "var(--color-outline-variant)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              AI Curated Synthesis
            </p>
          </div>
          <h2
            className="text-2xl font-semibold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              lineHeight: "32px",
              color: isDark
                ? "var(--color-on-primary)"
                : "var(--color-on-surface)",
            }}
          >
            Executive Summary
          </h2>
          <p
            className="text-base max-w-2xl"
            style={{
              fontFamily: "var(--font-body)",
              lineHeight: "24px",
              color: isDark
                ? "var(--color-outline-variant)"
                : "var(--color-on-surface-variant)",
            }}
          >
            High-signal, low-noise briefings on the critical developments
            shaping India today. Summarized by AI, verifiable via source links.
          </p>

          {/* Stats bar (only when loaded) */}
          {summary && uiState !== "loading" && (
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                {
                  label: "Sources",
                  value: summary.sourcesUsed?.length ?? 0,
                },
                {
                  label: "Articles",
                  value: summary.totalArticlesProcessed ?? 0,
                },
                {
                  label: "Categories",
                  value: filteredCategories.length,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(79, 70, 229, 0.15)"
                      : "rgba(79, 70, 229, 0.08)",
                    color: isDark
                      ? "var(--color-primary-fixed-dim)"
                      : "var(--color-primary)",
                  }}
                >
                  <span className="font-bold">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Error State */}
        {uiState === "error" && (
          <ErrorState
            isDark={isDark}
            onRetry={() => fetchLatestSummary(false)}
          />
        )}

        {/* Loading State: Skeleton Grid */}
        {uiState === "loading" && (
          <div
            id="skeleton-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} isDark={isDark} />
            ))}
          </div>
        )}

        {/* Loaded / Refreshing State: News Grid */}
        {(uiState === "loaded" || uiState === "refreshing") &&
          filteredCategories.length > 0 && (
            <div
              id="news-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]"
            >
              {filteredCategories.map((cat) => (
                <CategoryCard
                  key={cat.name}
                  category={cat}
                  isDark={isDark}
                />
              ))}
            </div>
          )}

        {/* Empty filter result */}
        {(uiState === "loaded" || uiState === "refreshing") &&
          filteredCategories.length === 0 &&
          summary && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <h3
                className="text-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: isDark
                    ? "var(--color-on-primary)"
                    : "var(--color-on-surface)",
                }}
              >
                No articles in this category
              </h3>
              <p
                className="text-base"
                style={{
                  color: isDark
                    ? "var(--color-outline-variant)"
                    : "var(--color-on-surface-variant)",
                }}
              >
                Try selecting &quot;Latest&quot; to see all categories.
              </p>
            </div>
          )}
      </main>

      <Footer isDark={isDark} />
    </>
  );
}
