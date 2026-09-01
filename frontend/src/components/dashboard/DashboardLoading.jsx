import React from "react";

const DashboardLoading = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
      </div>

      <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
};

export default DashboardLoading;
