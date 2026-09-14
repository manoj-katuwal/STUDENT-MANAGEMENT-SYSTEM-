import React, { useState } from "react";
import StudentFeeContextBar from "../components/studentFee/StudentFeeContextBar";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";
import StudentFeeHeader from "../components/studentFee/StudentFeeHeader";
import StudentFeeStats from "../components/studentFee/StudentFeeStats";
import StudentFeeFilters from "../components/studentFee/StudentFeeFilters";
import StudentFeeTable from "../components/studentFee/StudentFeeTable";
import { useStudentFees } from "../features/studentFee/studentFee.hooks";
import StudentFeeViewModal from "../components/studentFee/StudentFeeViewModel";

const StudentFeePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  const { data, isLoading, isError, refetch } = useStudentFees({
    page: 1,
    limit: 10,
  });
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);
  console.log("Student Fee Data:", data);
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentFeeContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <StudentFeeHeader />
      <StudentFeeStats />
      <StudentFeeFilters />
      <StudentFeeTable
        studentFees={data?.studentFees ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onView={(studentFee) => setSelectedStudentFee(studentFee)}
        onEdit={(studentFee) => console.log("Edit", studentFee)}
        onCancel={(studentFee) => console.log("Cancel", studentFee)}
      />

      <StudentFeeViewModal
        studentFee={selectedStudentFee}
        onClose={() => setSelectedStudentFee(null)}
      />
    </div>
  );
};

export default StudentFeePage;
