const ClassStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                {/* Title Skeleton */}
                <div className="h-3 w-24 rounded bg-slate-200" />
                {/* Number Value Skeleton */}
                <div className="h-8 w-16 rounded-md bg-slate-200" />
              </div>
              {/* Icon Container Skeleton */}
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
            </div>
          </div>

          {/* Footer Area Skeleton */}
          <div className="mt-6 flex items-center justify-between pt-2">
            <div className="h-3 w-32 rounded bg-slate-200" />
            {/* Progress bar structure active card ko jsto dekhauna */}
            {index === 1 && (
              <div className="h-2 w-16 rounded-full bg-slate-200" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassStatsSkeleton;
