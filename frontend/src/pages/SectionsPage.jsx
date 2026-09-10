import { useState } from "react";
import {
  useSections,
  useSectionStats,
} from "../features/sections/section.hook";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import SectionContextBar from "../components/sections/SectionContextBar";
import SectionHeader from "../components/sections/SectionHeader";

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

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <SectionContextBar />
      <SectionHeader onAdd={() => navigate("/sections/new")} onExport={() => {}} />
    </div>
  );
};

export default SectionsPage;
