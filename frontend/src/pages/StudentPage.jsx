import {
  useStudents,
  useStudentStats,
} from "../features/students/student.hooks";
import StudentContextBar from "../components/students/StudentContextBar";
import StudentHeader from "../components/students/StudentHeader";
import StudentStats from "../components/students/StudentStats";
import StudentFilters from "../components/students/StudentFilters";
import { useState } from "react";

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const { data, isLoading, isError, error } = useStudents({
    search,
    classId,
    sectionId,
  });
  const { data: statsData, isLoading: isStatsLoading } = useStudentStats();

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  if (isError) {
    return <div>Failed to load students: {error?.message}</div>;
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
    </div>
  );
};

export default StudentsPage;
