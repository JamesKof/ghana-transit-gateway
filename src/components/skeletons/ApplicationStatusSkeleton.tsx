import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationStatusSkeleton() {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border min-h-[400px] flex flex-col">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-5 w-full mx-auto" />
          </div>
          
          <div className="space-y-4 mb-8 flex-grow">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
          
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
