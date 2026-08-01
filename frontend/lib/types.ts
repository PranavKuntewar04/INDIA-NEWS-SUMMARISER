/* ============================================================
   Type definitions matching the backend API response shape
   See: architecture.md § 8.2
   ============================================================ */

export interface Source {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
}

export interface Category {
  name: string;
  icon?: string;
  articleCount: number;
  summaryPoints: string[];
  sources: Source[];
}

export interface SummaryMetadata {
  modelUsed: string;
  pipelineDurationMs: number;
  errors: string[];
}

export interface NewsSummary {
  id: string;
  timestamp: string;
  generatedAt: string;
  sourcesUsed: string[];
  totalArticlesProcessed: number;
  totalArticlesAfterDedup: number;
  categories: Category[];
  metadata?: SummaryMetadata;
}

/** Category → emoji icon mapping */
export const CATEGORY_ICONS: Record<string, string> = {
  Politics: "🏛️",
  Sports: "⚽",
  Business: "💼",
  Technology: "💻",
  Entertainment: "🎬",
  Health: "🏥",
  Education: "📚",
  Crime: "⚖️",
  Weather: "🌦️",
  World: "🌍",
  Environment: "🌿",
};

/** Navigation filter items */
export const NAV_FILTERS = [
  { label: "Latest", value: "all" },
  { label: "Policy", value: "Politics" },
  { label: "Tech", value: "Technology" },
  { label: "Finance", value: "Business" },
] as const;

export type NavFilterValue = (typeof NAV_FILTERS)[number]["value"];
