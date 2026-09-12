const AcademicYearLoading = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="animate-pulse">
        <div className="h-12 border-b border-slate-200/80 bg-slate-50/50" />
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="grid grid-cols-6 items-center gap-4 border-b border-slate-100 px-6 py-4"
          >
            <div className="h-4.5 w-3/4 rounded bg-slate-200/70" />
            <div className="h-4.5 w-24 rounded bg-slate-200/70" />
            <div className="h-4.5 w-24 rounded bg-slate-200/70" />
            <div className="h-6 w-20 rounded-full bg-slate-200/70" />
            <div className="h-6 w-20 rounded-full bg-slate-200/70" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicYearLoading;
