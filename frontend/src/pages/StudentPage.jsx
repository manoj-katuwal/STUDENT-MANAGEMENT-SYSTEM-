import {
  useExportStudentsCsv,
  useStudents,
  useStudentStats,
} from "../features/students/student.hooks";
import StudentContextBar from "../components/students/StudentContextBar";
import StudentHeader from "../components/students/StudentHeader";
import StudentStats from "../components/students/StudentStats";
import StudentFilters from "../components/students/StudentFilters";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import StudentTable from "../components/students/StudentTable";
import StudentPagination from "../components/students/StudentPagination";

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    try {
      const blob = await exportStudentsMutation.mutateAsync({
        search: debouncedSearch,
        classId,
        sectionId,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export students:", error);
    }
  };

  const totalStudents =
    statsData?.totalStudents ?? data?.pagination?.total ?? 0;

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentContextBar />
      <StudentHeader
        totalStudents={totalStudents}
        onExport={handleExportCsv}
        isExporting={exportStudentsMutation.isPending}
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
      {/* )} */}
    </div>
  );
};

export default StudentsPage;
