function AcademicYearSummary({ summaries = [] }) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Academic Year Summary
        </h2>

        <p className="text-sm text-gray-500">Collection by academic year</p>
      </div>

      {summaries.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            No academic year data available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-3 font-medium">Academic Year</th>
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 text-right font-medium">Collection</th>
              </tr>
            </thead>

            <tbody>
              {summaries.map((item) => (
                <tr
                  key={item.academicYearId}
                  className="border-b last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {item.academicYear?.name || "-"}
                      </span>

                      {item.academicYear?.isCurrent && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          Current
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {formatDate(item.academicYear?.startDate)} -{" "}
                    {formatDate(item.academicYear?.endDate)}
                  </td>

                  <td className="py-4 text-right text-sm font-semibold text-gray-900">
                    Rs. {item.totalCollection}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AcademicYearSummary;
