import FeeStructureContextBar from "../components/feeStructures/FeeStructureContextBar";
import FeeStructureHeader from "../components/feeStructures/FeeStructureHeader";
import FeeStructureStats from "../components/feeStructures/FeeStructureStats";
import {
  useCurrentAcademicYear,
} from "../features/academicYear/academicYear.hooks";
import { useFeeStructureStats } from "../features/feeStructures/feeStructure.hook";

const FeeStructurePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();

  const { data: stats, isLoading: isStatsLoading } = useFeeStructureStats();
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <FeeStructureContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <FeeStructureHeader onAdd={() => {}} />
      <FeeStructureStats stats={stats} isLoading={isStatsLoading} />
    </div>
  );
};

export default FeeStructurePage;
