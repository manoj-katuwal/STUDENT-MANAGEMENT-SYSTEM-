import React from "react";

import AcademicYearPageContextBar from "../components/academicYear/AcademicYearContextBar";
import AcademicYearHeader from "../components/academicYear/AcademicYearHeader";
import AcademicYearStats from "../components/academicYear/AcademicYearStats";

const AcademicYearPage = () => {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <AcademicYearPageContextBar />
      <AcademicYearHeader />
      <AcademicYearStats />
    </div>
  );
};

export default AcademicYearPage;
