import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useClasses } from "../features/classes/class.hooks";
import ClassContextBar from "../components/classes/ClassContextBar";
import ClassesHeader from "../components/classes/ClassHeader";
import { useNavigate } from "react-router-dom";
import ClassStats from "../components/classes/ClassStats";

const ClassesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 700);

  const { data, isLoading, isError, error, refetch } = useClasses({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
  });

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ClassContextBar onAdd={() => navigate("/classes/new")} />
      <ClassesHeader />
      <ClassStats />
    </div>
  );
};

export default ClassesPage;
