interface SkeletonCardProps {
  isDark: boolean;
}

export default function SkeletonCard({ isDark }: SkeletonCardProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col h-full border"
      style={{
        backgroundColor: isDark
          ? "var(--color-inverse-surface)"
          : "var(--color-surface-container-lowest)",
        borderColor: isDark
          ? "rgba(199, 196, 216, 0.15)"
          : "rgba(199, 196, 216, 0.3)",
        boxShadow: isDark ? "none" : "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Category badge skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton h-6 w-6 rounded-full" />
        <div className="skeleton h-5 w-20 rounded" />
      </div>

      {/* Headline skeleton */}
      <div className="skeleton h-6 w-3/4 rounded mb-2" />
      <div className="skeleton h-6 w-1/2 rounded mb-4" />

      {/* Summary points skeleton */}
      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex gap-2 items-start">
          <div className="skeleton w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
        <div className="flex gap-2 items-start">
          <div className="skeleton w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
        <div className="flex gap-2 items-start">
          <div className="skeleton w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" />
          <div className="skeleton h-4 w-5/6 rounded" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div
        className="flex justify-between items-center pt-4 border-t"
        style={{
          borderColor: isDark
            ? "rgba(199, 196, 216, 0.15)"
            : "rgba(199, 196, 216, 0.3)",
        }}
      >
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
      </div>
    </div>
  );
}
