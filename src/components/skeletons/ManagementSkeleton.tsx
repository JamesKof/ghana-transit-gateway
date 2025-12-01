import { Skeleton } from "@/components/ui/skeleton";

export function ManagementSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-3xl p-8 shadow-xl border border-border min-h-[500px] flex flex-col"
        >
          <div className="mb-6">
            <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          
          <div className="space-y-6 flex-grow">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
          
          <Skeleton className="h-12 w-full rounded-xl mt-6" />
        </div>
      ))}
    </div>
  );
}

export function ManagementSkeletonMobile() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-3xl p-8 shadow-xl border border-border min-h-[500px] flex flex-col"
        >
          <div className="mb-6">
            <Skeleton className="w-14 h-14 rounded-2xl mb-4" />
            <Skeleton className="h-7 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          <div className="space-y-5 flex-grow">
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
          
          <Skeleton className="h-12 w-full rounded-xl mt-6" />
        </div>
      ))}
    </div>
  );
}
