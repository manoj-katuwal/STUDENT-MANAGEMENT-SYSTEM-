import { useState } from "react";

import AcademicYearPageContextBar from "../components/academicYear/AcademicYearContextBar";
import AcademicYearHeader from "../components/academicYear/AcademicYearHeader";
import AcademicYearStats from "../components/academicYear/AcademicYearStats";
import AcademicYearTable from "../components/academicYear/AcademicYearTable";
import {
  useAcademicYears,
  useAcademicYearStats,
  useActivateAcademicYear,
  useDeactivateAcademicYear,
} from "../features/academicYear/academicYear.hooks";
import AcademicYearPagination from "../components/academicYear/AcademicYearPagination";
import CreateAcademicYearModal from "../components/academicYear/CreateAcademicYearModal";
import EditAcademicYearModel from "../components/academicYear/EditAcademicYearModel";
import ConfirmModal from "../components/common/ConfirmModal";
import ViewAcademicYearModal from "../components/academicYear/ViewAcademicYearModal";

const AcademicYearPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [viewAcademicYear, setViewAcademicYear] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const { data, isLoading, isError, refetch } = useAcademicYears({
    page: currentPage,
    limit: 10,
  });
  const { data: stats } = useAcademicYearStats();

  const activateMutation = useActivateAcademicYear();
  const deactivateMutation = useDeactivateAcademicYear();

  const handleConfirmStatusChange = () => {
    if (!statusTarget) return;

    const mutation =
      statusTarget.status === "ACTIVE" ? deactivateMutation : activateMutation;

    mutation.mutate(statusTarget._id, {
      onSuccess: () => setStatusTarget(null),
    });
  };

  const isStatusChangePending =
    activateMutation.isPending || deactivateMutation.isPending;

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <AcademicYearPageContextBar />
      <AcademicYearHeader
        onAdd={() => setIsCreateModalOpen(true)}
        totalAcademicYears={
          stats?.totalAcademicYears ?? data?.pagination?.total ?? 0
        }
      />
      <AcademicYearStats stats={stats} />
      <AcademicYearTable
        academicYears={data?.academicYears ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={(academicYear) => {
          setSelectedAcademicYear(academicYear);
        }}
        onView={setViewAcademicYear}
        onToggleStatus={setStatusTarget}
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

      <ViewAcademicYearModal
        open={Boolean(viewAcademicYear)}
        academicYear={viewAcademicYear}
        onClose={() => setViewAcademicYear(null)}
      />

      <ConfirmModal
        open={Boolean(statusTarget)}
        title={
          statusTarget?.status === "ACTIVE"
            ? "Deactivate Academic Year"
            : "Activate Academic Year"
        }
        message={
          statusTarget?.status === "ACTIVE"
            ? `Are you sure you want to deactivate "${statusTarget.name}"?`
            : `Activate "${statusTarget?.name}" as the current academic year? The current academic year will be changed.`
        }
        confirmText={
          statusTarget?.status === "ACTIVE" ? "Deactivate" : "Activate"
        }
        variant={statusTarget?.status === "ACTIVE" ? "warning" : "info"}
        isLoading={isStatusChangePending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
};

export default AcademicYearPage;
