import { useStudents } from "../features/students/student.hooks";
import StudentContextBar from "../components/students/StudentContextBar";
import StudentHeader from "../components/students/StudentHeader";
import StudentStats from "../components/students/StudentStats";

const StudentsPage = () => {
  const { data, isLoading, isError, error } = useStudents();

  console.log("Students data:", data);

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  if (isError) {
    return <div>Failed to load students: {error?.message}</div>;
  }

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentContextBar />
      <StudentHeader
        totalStudents={data?.pagination?.total ?? data?.students?.length}
      />
      <StudentStats data={data} />
    </div>
  );
};

export default StudentsPage;
