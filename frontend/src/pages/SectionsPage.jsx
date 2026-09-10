import { useState } from "react";
import { useSections, useSectionStats } from "../features/sections/section.hook";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";



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

  return <div>Sections Page</div>;
};

export default SectionsPage;
