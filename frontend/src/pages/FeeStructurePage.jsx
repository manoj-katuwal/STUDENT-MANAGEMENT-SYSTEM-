import FeeStructureContextBar from "../components/feeStructures/FeeStructureContextBar";
import FeeStructureHeader from "../components/feeStructures/FeeStructureHeader";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";

const FeeStructurePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <FeeStructureContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <FeeStructureHeader onAdd={() => {}} />
    </div>
  );
};

export default FeeStructurePage;
