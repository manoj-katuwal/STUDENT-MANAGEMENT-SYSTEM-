import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import {
  useClasses,
  useClassStats,
  useExportClassesCsv,
  useUpdateClassStatus,
} from "../features/classes/class.hooks";
import ClassContextBar from "../components/classes/ClassContextBar";
import ClassesHeader from "../components/classes/ClassHeader";
import { useNavigate } from "react-router-dom";
import ClassStats from "../components/classes/ClassStats";
import ClassFilters from "../components/classes/ClassFilters";
import ClassTable from "../components/classes/ClassTable";
import ClassPagination from "../components/classes/ClassPagination";
import ConfirmModal from "../components/common/ConfirmModal";

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
    status: selectedStatus || undefined,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: statsRefetch,
  } = useClassStats();

  const updateStatusMutation = useUpdateClassStatus();
  const exportClassesMutation = useExportClassesCsv();
  const [selectedClassForStatus, setSelectedClassForStatus] = useState(null);

  const handleExportCsv = async () => {
    const blob = await exportClassesMutation.mutateAsync({
      search: debouncedSearch,
      status: selectedStatus,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "classes.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleToggleStatus = (classRecord) => {
    setSelectedClassForStatus(classRecord);
  };

  const handleConfirmStatusChange = () => {
    if (!selectedClassForStatus) return;

    const nextStatus =
      selectedClassForStatus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    updateStatusMutation.mutate(
      {
        classId: selectedClassForStatus._id,
        status: nextStatus,
      },
      {
        onSettled: () => {
          setSelectedClassForStatus(null);
        },
      },
    );
  };

  const totalClasses = statsData?.totalClasses ?? data?.pagination?.total ?? 0;

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ClassContextBar onAdd={() => navigate("/classes/new")} />
      <ClassesHeader
        totalClasses={totalClasses}
        onAdd={() => navigate("/classes/new")}
        onExport={handleExportCsv}
        isExporting={exportClassesMutation.isPending}
      />
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
        onToggleStatus={handleToggleStatus}
      />
      <ClassPagination
        pagination={data?.pagination}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <ConfirmModal
        open={Boolean(selectedClassForStatus)}
        title={
          selectedClassForStatus?.status === "ACTIVE"
            ? "Deactivate Class"
            : "Activate Class"
        }
        message={
          selectedClassForStatus?.status === "ACTIVE"
            ? `Are you sure you want to deactivate "${selectedClassForStatus?.name}"? Students and fees associated with this class may be affected.`
            : `Are you sure you want to activate "${selectedClassForStatus?.name}"? It will become active and accessible across the system.`
        }
        confirmText={
          selectedClassForStatus?.status === "ACTIVE"
            ? "Deactivate"
            : "Activate"
        }
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setSelectedClassForStatus(null)}
      />
    </div>
  );
};

export default ClassesPage;
