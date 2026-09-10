import { useState } from "react";
import {
  useSections,
  useSectionStats,
  useUpdateSectionStatus,
} from "../features/sections/section.hook";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import SectionContextBar from "../components/sections/SectionContextBar";
import SectionHeader from "../components/sections/SectionHeader";
import SectionStats from "../components/sections/SectionStats";
import { useClasses } from "../features/classes/class.hooks";
import SectionFilters from "../components/sections/SectionFilters";
import SectionTable from "../components/sections/SectionTable";
import SectionPagination from "../components/sections/SectionPagination";
import ConfirmModal from "../components/common/ConfirmModal";

const SectionsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [statusTarget, setStatusTarget] = useState(null);

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

  const updateSectionStatusMutation = useUpdateSectionStatus();

  const { data: classesData } = useClasses({
    page: 1,
    limit: 100,
  });

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <SectionContextBar />
      <SectionHeader
        totalSections={statsData?.totalSections ?? data?.pagination?.total ?? 0}
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
        onView={(section) => navigate(`/sections/${section._id}`)}
        onEdit={(section) => navigate(`/sections/${section._id}/edit`)}
        onToggleStatus={(section) => {
          setStatusTarget(section);
        }}
      />

      <SectionPagination
        page={data?.pagination?.page || 1}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={setCurrentPage}
      />

      {statusTarget && (
        <ConfirmModal
          open={Boolean(statusTarget)}
          title={
            statusTarget.status === "ACTIVE"
              ? "Deactivate Section"
              : "Activate Section"
          }
          message={
            statusTarget.status === "ACTIVE"
              ? `Are you sure you want to deactivate section "${statusTarget.name}"?`
              : `Are you sure you want to activate section "${statusTarget.name}"?`
          }
          confirmText={
            statusTarget.status === "ACTIVE" ? "Deactivate" : "Activate"
          }
          onCancel={() => setStatusTarget(null)}
          onConfirm={() => {
            updateSectionStatusMutation.mutate(
              {
                sectionId: statusTarget._id,
                status:
                  statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              },
              {
                onSuccess: () => {
                  setStatusTarget(null);
                },
              },
            );
          }}
          loading={updateSectionStatusMutation.isPending}
        />
      )}
    </div>
  );
};

export default SectionsPage;
