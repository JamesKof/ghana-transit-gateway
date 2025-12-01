import { Skeleton } from "@/components/ui/skeleton";

export function QuickNavSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-10 border border-border shadow-md flex flex-col min-h-[280px] w-full"
        >
          <Skeleton className="w-20 h-20 rounded-2xl mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <Skeleton className="h-5 w-24 mt-auto" />
        </div>
      ))}
    </div>
  );
}

export function QuickNavSkeletonMobile() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-8 border border-border shadow-md flex flex-col min-h-[240px] w-full"
        >
          <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
          <Skeleton className="h-7 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-4" />
          <Skeleton className="h-5 w-20 mt-auto" />
        </div>
      ))}
    </div>
  );
}
