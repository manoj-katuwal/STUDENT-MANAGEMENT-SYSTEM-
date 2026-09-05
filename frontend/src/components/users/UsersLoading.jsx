const UsersLoading = () => {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-24 rounded bg-gray-200" />
            <div className="h-4 w-80 rounded bg-gray-200" />
          </div>

          <div className="h-10 w-28 rounded-lg bg-gray-200" />
        </div>

        {/* Filter */}
        <div className="h-16 rounded-xl bg-white ring-1 ring-gray-200" />

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
          <div className="h-12 border-b border-gray-100 bg-gray-50" />

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-16 items-center gap-6 border-b border-gray-100 px-6"
            >
              <div className="h-9 w-9 rounded-full bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-200" />
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersLoading;
