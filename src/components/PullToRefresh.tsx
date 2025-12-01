import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export function PullToRefresh({ pullDistance, isRefreshing, threshold }: PullToRefreshProps) {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const rotation = (pullDistance / threshold) * 360;

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center pointer-events-none transition-all duration-300"
      style={{
        transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
      }}
    >
      <div className="bg-card/95 backdrop-blur-sm rounded-full p-4 shadow-lg border border-border">
        <RefreshCw
          className={`w-6 h-6 text-primary transition-transform ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
          }}
        />
      </div>
      {!isRefreshing && (
        <div className="absolute top-full mt-2 text-sm text-muted-foreground font-medium">
          {progress >= 100 ? "Release to refresh" : "Pull to refresh"}
        </div>
      )}
    </div>
  );
}
