import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useClasses, useClassStats } from "../features/classes/class.hooks";
import ClassContextBar from "../components/classes/ClassContextBar";
import ClassesHeader from "../components/classes/ClassHeader";
import { useNavigate } from "react-router-dom";
import ClassStats from "../components/classes/ClassStats";
import ClassFilters from "../components/classes/ClassFilters";
import ClassTable from "../components/classes/ClassTable";
import ClassPagination from "../components/classes/ClassPagination";

const ClassesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  const debouncedSearch = useDebounce(search, 700);

  const { data, isLoading, isError, error, refetch } = useClasses({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: statsRefetch,
  } = useClassStats();

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ClassContextBar onAdd={() => navigate("/classes/new")} />
      <ClassesHeader />
      <ClassStats
        stats={statsData}
        isLoading={statsLoading}
        isError={statsError}
        refetch={statsRefetch}
      />
      <ClassFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
        onReset={() => {
          setSearch("");
          setSelectedStatus("");
          setCurrentPage(1);
        }}
      />
      <ClassTable
        classes={data?.classes ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onView={(classRecord) => navigate(`/classes/${classRecord._id}`)}
        onEdit={(classRecord) => navigate(`/classes/${classRecord._id}/edit`)}
        onToggleStatus={(classRecord) => {
          // TODO: implement toggle status
        }}
      />
      <ClassPagination
        pagination={data?.pagination}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default ClassesPage;
