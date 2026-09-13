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
  useFeeStructure,
  useFeeStructures,
  useFeeStructureStats,
  useUpdateFeeStructure,
} from "../features/feeStructures/feeStructure.hook";
import FeeStructureTable from "../components/feeStructures/FeeStructureTable";
import ViewFeeStructureModal from "../components/feeStructures/ViewFeeStructureModal";
import EditFeeStructureModal from "../components/feeStructures/EditFeeStructureModal";

const initialFilters = {
  academicYearId: "",
  classId: "",
  feeType: "",
  status: "",
};

const FeeStructurePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  const [filters, setFilters] = useState(initialFilters);
  const [viewFeeStructureId, setViewFeeStructureId] = useState(null);
  const [editFeeStructureId, setEditFeeStructureId] = useState(null);

  const { data: academicYearsData } = useAcademicYears({ page: 1, limit: 100 });
  const { data: classesData } = useClasses({ page: 1, limit: 100 });
  const {
    data: feeStructuresData,
    isLoading: isFeeStructureLoading,
    isError: isFeeStructureError,
    refetch,
  } = useFeeStructures({
    page: 1,
    limit: 100,
    ...filters,
  });

  const { data: viewedFeeStructure } = useFeeStructure(viewFeeStructureId);
  const { data: editingFeeStructure } = useFeeStructure(editFeeStructureId);
  const updateFeeStructureMutation = useUpdateFeeStructure();

  const handleFilterChange = (key, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  };

  const { data: stats, isLoading: isStatsLoading } = useFeeStructureStats();
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <FeeStructureContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <FeeStructureHeader onAdd={() => {}} />
      <FeeStructureStats stats={stats} isLoading={isStatsLoading} />
      <FeeStructureFilters
        filters={filters}
        academicYears={academicYearsData?.academicYears ?? []}
        classes={classesData?.classes ?? []}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters(initialFilters)}
        resultCount={feeStructuresData?.pagination?.total}
      />
      <FeeStructureTable
        feeStructures={feeStructuresData?.feeStructures ?? []}
        isLoading={isFeeStructureLoading}
        isError={isFeeStructureError}
        onView={(feeStructure) => setViewFeeStructureId(feeStructure._id)}
        onEdit={(feeStructure) => setEditFeeStructureId(feeStructure._id)}
        onToggleStatus={() => {}}
        onRetry={refetch}
      />
      <ViewFeeStructureModal
        feeStructure={viewedFeeStructure}
        onClose={() => setViewFeeStructureId(null)}
      />

      <EditFeeStructureModal
        feeStructure={editingFeeStructure}
        academicYears={academicYearsData?.academicYears ?? []}
        classList={classesData?.classes ?? []}
        onClose={() => setEditFeeStructureId(null)}
        onSubmit={(updateData) => {
          updateFeeStructureMutation.mutate(
            { feeStructureId: editFeeStructureId, updateData },
            { onSuccess: () => setEditFeeStructureId(null) },
          );
        }}
        isPending={updateFeeStructureMutation.isPending}
      />
    </div>
  );
};

export default FeeStructurePage;
