import { useState } from "react";

import AcademicYearPageContextBar from "../components/academicYear/AcademicYearContextBar";
import AcademicYearHeader from "../components/academicYear/AcademicYearHeader";
import AcademicYearStats from "../components/academicYear/AcademicYearStats";
import AcademicYearTable from "../components/academicYear/AcademicYearTable";
import { useAcademicYears } from "../features/academicYear/academicYear.hooks";
import AcademicYearPagination from "../components/academicYear/AcademicYearPagination";
import CreateAcademicYearModal from "../components/academicYear/CreateAcademicYearModal";
import EditAcademicYearModel from "../components/academicYear/EditAcademicYearModel";

const AcademicYearPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
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
        onEdit={(academicYear) => {
          setSelectedAcademicYear(academicYear);
        }}
      />
      <AcademicYearPagination
        pagination={data?.pagination}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <CreateAcademicYearModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditAcademicYearModel
        key={selectedAcademicYear?._id ?? "closed"}
        open={Boolean(selectedAcademicYear)}
        academicYear={selectedAcademicYear}
        onClose={() => setSelectedAcademicYear(null)}
      />
    </div>
  );
};

export default AcademicYearPage;
