import { useState } from "react";
import FeeStructureContextBar from "../components/feeStructures/FeeStructureContextBar";
import FeeStructureFilters from "../components/feeStructures/FeeStructureFilters";
import FeeStructureHeader from "../components/feeStructures/FeeStructureHeader";
import FeeStructureStats from "../components/feeStructures/FeeStructureStats";
import {
  useAcademicYears,
  useCurrentAcademicYear,
} from "../features/academicYear/academicYear.hooks";
import { useClasses } from "../features/classes/class.hooks";
import {
  useActivateFeeStructure,
  useCreateFeeStructure,
  useDeactivateFeeStructure,
  useExportFeeStructuresCsv,
  useFeeStructure,
  useFeeStructures,
  useFeeStructureStats,
  useUpdateFeeStructure,
} from "../features/feeStructures/feeStructure.hook";
import FeeStructureTable from "../components/feeStructures/FeeStructureTable";
import ViewFeeStructureModal from "../components/feeStructures/ViewFeeStructureModal";
import EditFeeStructureModal from "../components/feeStructures/EditFeeStructureModal";
import CreateFeeStructureModal from "../components/feeStructures/CreateFeeStructureModal";
import ConfirmModal from "../components/common/ConfirmModal";
import FeeStructurePagination from "../components/feeStructures/FeeStructurePagination";

const initialFilters = {
  search: "",
  academicYearId: "",
  classId: "",
  feeType: "",
  status: "",
};

const FeeStructurePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [viewFeeStructureId, setViewFeeStructureId] = useState(null);
  const [editFeeStructureId, setEditFeeStructureId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null);

  const { data: academicYearsData } = useAcademicYears({ page: 1, limit: 100 });
  const { data: classesData } = useClasses({ page: 1, limit: 100 });
  const {
    data: feeStructuresData,
    isLoading: isFeeStructureLoading,
    isError: isFeeStructureError,
    refetch,
  } = useFeeStructures({
    page: currentPage,
    limit: 10,
    ...filters,
  });

  const { data: viewedFeeStructure } = useFeeStructure(viewFeeStructureId);
  const { data: editingFeeStructure } = useFeeStructure(editFeeStructureId);
  const updateFeeStructureMutation = useUpdateFeeStructure();
  const createFeeStructureMutation = useCreateFeeStructure();

  const deactivateFeeStructureMutation = useDeactivateFeeStructure();
  const activateFeeStructureMutation = useActivateFeeStructure();
  const exportFeeStructuresMutation = useExportFeeStructuresCsv();
  const { data: stats, isLoading: isStatsLoading } = useFeeStructureStats();

  const handleConfirmStatusChange = async () => {
    if (!statusAction) return;

    const mutation =
      statusAction.status === "ACTIVE"
        ? deactivateFeeStructureMutation
        : activateFeeStructureMutation;

    try {
      await mutation.mutateAsync(statusAction._id);
      setStatusAction(null);
    } catch {
      // Keep the confirmation modal open when the API rejects the change.
    }
  };

  const isStatusChangePending =
    deactivateFeeStructureMutation.isPending ||
    activateFeeStructureMutation.isPending;

  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleExportCsv = async () => {
    const blob = await exportFeeStructuresMutation.mutateAsync(filters);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "fee-structures.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <FeeStructureContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <FeeStructureHeader
        onExport={handleExportCsv}
        isExporting={exportFeeStructuresMutation.isPending}
        onAdd={() => {
          createFeeStructureMutation.reset();
          setIsCreateModalOpen(true);
        }}
      />
      <FeeStructureStats stats={stats} isLoading={isStatsLoading} />
      <FeeStructureFilters
        filters={filters}
        academicYears={academicYearsData?.academicYears ?? []}
        classes={classesData?.classes ?? []}
        onFilterChange={handleFilterChange}
        onClear={() => {
          setFilters(initialFilters);
          setCurrentPage(1);
        }}
        resultCount={feeStructuresData?.pagination?.total}
      />
      <FeeStructureTable
        feeStructures={feeStructuresData?.feeStructures ?? []}
        isLoading={isFeeStructureLoading}
        isError={isFeeStructureError}
        onView={(feeStructure) => setViewFeeStructureId(feeStructure._id)}
        onEdit={(feeStructure) => {
          updateFeeStructureMutation.reset();
          setEditFeeStructureId(feeStructure._id);
        }}
        onToggleStatus={setStatusAction}
        onRetry={refetch}
      />
      <ViewFeeStructureModal
        feeStructure={viewedFeeStructure}
        onClose={() => setViewFeeStructureId(null)}
      />

      <ConfirmModal
        open={Boolean(statusAction)}
        title={
          statusAction?.status === "ACTIVE"
            ? "Deactivate Fee Structure"
            : "Activate Fee Structure"
        }
        message={
          statusAction?.status === "ACTIVE"
            ? `Deactivate the ${statusAction?.feeType?.toLowerCase()} fee for ${statusAction?.classId?.name ?? "this class"}?`
            : `Activate the ${statusAction?.feeType?.toLowerCase()} fee for ${statusAction?.classId?.name ?? "this class"}?`
        }
        confirmText={
          statusAction?.status === "ACTIVE" ? "Deactivate" : "Activate"
        }
        variant={statusAction?.status === "ACTIVE" ? "warning" : "info"}
        isLoading={isStatusChangePending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusAction(null)}
      />

      <EditFeeStructureModal
        feeStructure={editingFeeStructure}
        academicYears={academicYearsData?.academicYears ?? []}
        classList={classesData?.classes ?? []}
        onClose={() => setEditFeeStructureId(null)}
        onSubmit={async (updateData) => {
          try {
            await updateFeeStructureMutation.mutateAsync({
              feeStructureId: editFeeStructureId,
              updateData,
            });
            setEditFeeStructureId(null);
          } catch {
            // The modal displays the API error and remains open for correction.
          }
        }}
        isPending={updateFeeStructureMutation.isPending}
        error={updateFeeStructureMutation.error}
      />

      {isCreateModalOpen && (
        <CreateFeeStructureModal
          academicYears={academicYearsData?.academicYears ?? []}
          classList={classesData?.classes ?? []}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (feeStructureData) => {
            try {
              await createFeeStructureMutation.mutateAsync(feeStructureData);
              setIsCreateModalOpen(false);
            } catch {
              // The modal displays the API error and remains open for correction.
            }
          }}
          isPending={createFeeStructureMutation.isPending}
          error={createFeeStructureMutation.error}
        />
      )}

      <FeeStructurePagination
        pagination={feeStructuresData?.pagination}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default FeeStructurePage;
