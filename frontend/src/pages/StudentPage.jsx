import {
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

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const debouncedSearch = useDebounce(search, 700);
  const { data, isLoading, isError, error } = useStudents({
    search: debouncedSearch,
    classId,
    sectionId,
  });
  const { data: statsData, isLoading: isStatsLoading } = useStudentStats();

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
  };

  const totalStudents =
    statsData?.totalStudents ?? data?.pagination?.total ?? 0;

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentContextBar />
      <StudentHeader totalStudents={totalStudents} />
      <StudentStats data={statsData} isLoading={isStatsLoading} />
      <StudentFilters
        search={search}
        onSearchChange={setSearch}
        classId={classId}
        onClassChange={setClassId}
        sectionId={sectionId}
        onSectionChange={setSectionId}
        onReset={handleResetFilters}
      />
      <StudentTable students={data?.students ?? []} isLoading={isLoading} />
    </div>
  );
};

export default StudentsPage;
