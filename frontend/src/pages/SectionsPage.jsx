import { useState } from "react";
import {
  useSections,
  useSectionStats,
} from "../features/sections/section.hook";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import SectionContextBar from "../components/sections/SectionContextBar";
import SectionHeader from "../components/sections/SectionHeader";
import SectionStats from "../components/sections/SectionStats";
import { useClasses } from "../features/classes/class.hooks";
import SectionFilters from "../components/sections/SectionFilters";
import SectionTable from "../components/sections/SectionTable";

const SectionsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState("");

  const debouncedSearch = useDebounce(search, 700);

  const { data, isLoading, isError, error, refetch } = useSections({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
    classId: selectedClassId,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useSectionStats();

  const { data: classesData } = useClasses({
    page: 1,
    limit: 100,
  });

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <SectionContextBar />
      <SectionHeader
        onAdd={() => navigate("/sections/new")}
        onExport={() => {}}
      />
      <SectionStats
        stats={statsData}
        loading={statsLoading}
        error={statsError}
        onRetry={refetchStats}
      />
      <SectionFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        selectedClassId={selectedClassId}
        onClassChange={(value) => {
          setSelectedClassId(value);
          setCurrentPage(1);
        }}
        classes={classesData?.classes || []}
        onReset={() => {
          setSearch("");
          setSelectedClassId("");
          setCurrentPage(1);
        }}
      />

      <SectionTable
        sections={data?.sections || []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
};

export default SectionsPage;
