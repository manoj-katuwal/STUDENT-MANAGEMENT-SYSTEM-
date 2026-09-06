import { useStudents } from "../features/students/student.hooks";

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
    <div>
      <h1>Students</h1>

      <p>Total Students: {data?.pagination?.total ?? 0}</p>

      <pre>{JSON.stringify(data?.students, null, 2)}</pre>
    </div>
  );
};

export default StudentsPage;
