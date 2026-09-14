import React from "react";
import StudentFeeContextBar from "../components/studentFee/StudentFeeContextBar";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";
import StudentFeeHeader from "../components/studentFee/StudentFeeHeader";
import StudentFeeStats from "../components/studentFee/StudentFeeStats";
import StudentFeeFilters from "../components/studentFee/StudentFeeFilters";
import StudentFeeTable from "../components/studentFee/StudentFeeTable";

const StudentFeePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentFeeContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <StudentFeeHeader />
      <StudentFeeStats />
      <StudentFeeFilters />
      <StudentFeeTable />
    </div>
  );
};

export default StudentFeePage;
