import React from "react";
import { useParams } from "react-router-dom";
import { useStudent } from "../features/students/student.hooks";

const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const { data: student, isLoading, isError, error } = useStudent(studentId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error?.message || "Failed to load student"}</div>;
  }

  return (
    <div>
      <h1>{student?.name}</h1>
    </div>
  );
  return <div>Student Details Page</div>;
};

export default StudentDetailsPage;
