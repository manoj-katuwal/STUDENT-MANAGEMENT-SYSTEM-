import { useState } from "react";

import AcademicYearPageContextBar from "../components/academicYear/AcademicYearContextBar";
import AcademicYearHeader from "../components/academicYear/AcademicYearHeader";
import AcademicYearStats from "../components/academicYear/AcademicYearStats";
import AcademicYearTable from "../components/academicYear/AcademicYearTable";
import { useAcademicYears } from "../features/academicYear/academicYear.hooks";
import AcademicYearPagination from "../components/academicYear/AcademicYearPagination";
import CreateAcademicYearModal from "../components/academicYear/CreateAcademicYearModal";

const AcademicYearPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useAcademicYears({
    page: currentPage,
    limit: 10,
  });

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <AcademicYearPageContextBar />
      <AcademicYearHeader onAdd={() => setIsCreateModalOpen(true)} />
      <AcademicYearStats />
      <AcademicYearTable
        academicYears={data?.academicYears ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
      <AcademicYearPagination
        pagination={data?.pagination}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <CreateAcademicYearModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AcademicYearPage;
