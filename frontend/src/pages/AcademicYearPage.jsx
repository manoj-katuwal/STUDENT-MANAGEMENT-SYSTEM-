import React from "react";

import AcademicYearPageContextBar from "../components/academicYear/AcademicYearContextBar";
import AcademicYearHeader from "../components/academicYear/AcademicYearHeader";

const AcademicYearPage = () => {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <AcademicYearPageContextBar />
      <AcademicYearHeader />
    </div>
  );
};

export default AcademicYearPage;
