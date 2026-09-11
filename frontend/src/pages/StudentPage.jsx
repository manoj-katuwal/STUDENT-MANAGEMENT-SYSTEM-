import {
  useExportStudentsCsv,
  useStudents,
  useStudentStats,
} from "../features/students/student.hooks";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";
import StudentContextBar from "../components/students/StudentContextBar";
import StudentHeader from "../components/students/StudentHeader";
import StudentStats from "../components/students/StudentStats";
import StudentFilters from "../components/students/StudentFilters";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import StudentTable from "../components/students/StudentTable";
import StudentPagination from "../components/students/StudentPagination";
import CreateStudentModal from "../components/students/CreateStudentModal";

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const exportStudentsMutation = useExportStudentsCsv();
  const debouncedSearch = useDebounce(search, 700);

  const { data, isLoading, isError, error } = useStudents({
    search: debouncedSearch,
    classId,
    sectionId,
    page: currentPage,
    limit: 10,
  });
  const { data: statsData, isLoading: isStatsLoading } = useStudentStats();
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();

  const pagination = data?.pagination;

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Failed to load students: {error?.message}
      </div>
    );
  }

  const handleResetFilters = () => {
    setSearch("");
    setClassId("");
    setSectionId("");
    setCurrentPage(1);
  };

  const handleExportCsv = async () => {
    console.log("🚀 [Export CSV] Starting export with params:", {
      search: debouncedSearch,
      classId,
      sectionId,
    });

    try {
      const blob = await exportStudentsMutation.mutateAsync({
        search: debouncedSearch,
        classId,
        sectionId,
      });

      console.log("📦 [Export CSV] Blob received successfully:", {
        size: `${(blob.size / 1024).toFixed(2)} KB`,
        type: blob.type,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      console.log("✅ [Export CSV] Download initiated and completed!");
    } catch (error) {
      console.error("❌ [Export CSV] Failed to export students:", error);
    }
  };

  const totalStudents =
    statsData?.totalStudents ?? data?.pagination?.total ?? 0;

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
        totalStudents={totalStudents}
      />
      <StudentHeader
        totalStudents={totalStudents}
        onExport={handleExportCsv}
        isExporting={exportStudentsMutation.isPending}
        onAdd={() => setIsCreateModalOpen(true)}
      />
      <StudentStats data={statsData} isLoading={isStatsLoading} />
      <StudentFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        classId={classId}
        onClassChange={(value) => {
          setClassId(value);
          setCurrentPage(1);
        }}
        sectionId={sectionId}
        onSectionChange={(value) => {
          setSectionId(value);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />
      <StudentTable students={data?.students ?? []} isLoading={isLoading} />
      {/* {pagination && pagination.totalPages > 1 && ( */}
      <StudentPagination
        page={pagination?.page || 1}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setCurrentPage}
        limit={pagination?.limit || 10}
        total={pagination?.total || 0}
      />
      <CreateStudentModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {/* )} */}
    </div>
  );
};

export default StudentsPage;
