import React from "react";
import StudentFeeContextBar from "../components/studentFee/StudentFeeContextBar";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";

const StudentFeePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentFeeContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
    </div>
  );
};

export default StudentFeePage;
