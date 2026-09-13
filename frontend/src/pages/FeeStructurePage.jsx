import FeeStructureContextBar from "../components/feeStructures/FeeStructureContextBar";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";

const FeeStructurePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  return (
    <div className="min-h-full p-6 lg:p-8">
      <FeeStructureContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
    </div>
  );
};

export default FeeStructurePage;
