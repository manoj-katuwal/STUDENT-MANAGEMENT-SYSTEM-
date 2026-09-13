import React, { useState } from 'react'
import { useFeeStructures } from '../features/feeStructures/feeStructure.hook';

const FeeStructurePage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
      academicYearId: "",
      classId: "",
      feeType: "",
      status: "",
    });

    const { data, isLoading, isError } = useFeeStructures({
      page: currentPage,
      limit: 10,
      ...filters,
    });
  return (
    <div>
      Fee Structure Page
    </div>
  )
}

export default FeeStructurePage
