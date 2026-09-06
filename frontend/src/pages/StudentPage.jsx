import { useStudents } from "../features/students/student.hooks";
import StudentContextBar from "../components/students/StudentContextBar";

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
    <div className="min-h-full p-6 lg:p-8">
      <StudentContextBar />
    </div>
  );
};

export default StudentsPage;
