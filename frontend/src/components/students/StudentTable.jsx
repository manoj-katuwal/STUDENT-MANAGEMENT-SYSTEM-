import React from "react";
import { Eye, Edit3, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentsTable = ({ students = [], isLoading = false }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Admission No.</th>
              <th className="py-3.5 px-4">Class</th>
              <th className="py-3.5 px-4">Section</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {/* Student */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-slate-200 rounded w-28" />
                      </div>
                    </div>
                  </td>
                  {/* Admission No */}
                  <td className="py-3 px-4">
                    <div className="h-5 bg-slate-200 rounded w-20" />
                  </td>
                  {/* Class */}
                  <td className="py-3 px-4">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </td>
                  {/* Section */}
                  <td className="py-3 px-4">
                    <div className="h-4 bg-slate-200 rounded w-12" />
                  </td>
                  {/* Phone */}
                  <td className="py-3 px-4">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </td>
                  {/* Status */}
                  <td className="py-3 px-4">
                    <div className="h-5 bg-slate-200 rounded-full w-16" />
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                      <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-slate-400 font-medium"
                >
                  No student records found.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                // Generate initials for Avatar badge
                const initials = student.name
                  ? student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "ST";

                const isActive = student.status?.toUpperCase() === "ACTIVE";

                return (
                  <tr
                    key={student._id || student.admissionNumber}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Student Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">
                            {student.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Admission Number */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {student.admissionNumber}
                      </span>
                    </td>

                    {/* Class (Populated Object) */}
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {student.classId?.name || "N/A"}
                    </td>

                    {/* Section (Populated Object) */}
                    <td className="py-3 px-4 text-slate-600">
                      {student.sectionId?.name || "N/A"}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.phone || "N/A"}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                          onClick={() => navigate(`/students/${student._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
