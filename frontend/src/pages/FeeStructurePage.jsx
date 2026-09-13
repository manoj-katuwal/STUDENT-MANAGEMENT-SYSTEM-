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
  useFeeStructures,
  useFeeStructureStats,
} from "../features/feeStructures/feeStructure.hook";

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

  const { data: academicYearsData } = useAcademicYears({ page: 1, limit: 100 });
  const { data: classesData } = useClasses({ page: 1, limit: 100 });
  const { data: feeStructuresData } = useFeeStructures({
    page: 1,
    limit: 100,
    ...filters,
  });

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
    </div>
  );
};

export default FeeStructurePage;
