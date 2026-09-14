import React, { useState } from "react";
import StudentFeeContextBar from "../components/studentFee/StudentFeeContextBar";
import { useCurrentAcademicYear } from "../features/academicYear/academicYear.hooks";
import StudentFeeHeader from "../components/studentFee/StudentFeeHeader";
import StudentFeeStats from "../components/studentFee/StudentFeeStats";
import StudentFeeFilters from "../components/studentFee/StudentFeeFilters";
import StudentFeeTable from "../components/studentFee/StudentFeeTable";
import {
  useCancelStudentFee,
  useCreateStudentFee,
  useStudentFees,
  useUpdateStudentFee,
} from "../features/studentFee/studentFee.hooks";
import StudentFeeViewModal from "../components/studentFee/StudentFeeViewModel";
import StudentFeeEditModal from "../components/studentFee/StudentFeeEditModel";
import StudentFeeCancelModal from "../components/studentFee/StudentFeeCancelModel";
import StudentFeeAssignModal from "../components/studentFee/StudentFeeAssignModal";

const StudentFeePage = () => {
  const { currentAcademicYear, isLoading: isAcademicYearLoading } =
    useCurrentAcademicYear();
  const { data, isLoading, isError, refetch } = useStudentFees({
    page: 1,
    limit: 10,
  });

  const createStudentFeeMutation = useCreateStudentFee();
  const updateStudentFeeMutation = useUpdateStudentFee();
  const cancelStudentFeeMutation = useCancelStudentFee();
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);
  const [editingStudentFee, setEditingStudentFee] = useState(null);
  const [cancellingStudentFee, setCancellingStudentFee] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <StudentFeeContextBar
        currentAcademicYear={currentAcademicYear}
        isLoading={isAcademicYearLoading}
      />
      <StudentFeeHeader onAssignFee={() => setIsAssignModalOpen(true)} />
      <StudentFeeStats />
      <StudentFeeFilters />
      <StudentFeeTable
        studentFees={data?.studentFees ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onView={(studentFee) => setSelectedStudentFee(studentFee)}
        onEdit={(studentFee) => setEditingStudentFee(studentFee)}
        onCancel={(studentFee) => {
          setCancellingStudentFee(studentFee);
        }}
      />

      <StudentFeeAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        isSubmitting={createStudentFeeMutation.isPending}
        onSubmit={(formData) => {
          createStudentFeeMutation.mutate(formData, {
            onSuccess: () => {
              setIsAssignModalOpen(false);
            },
          });
        }}
      />

      <StudentFeeViewModal
        studentFee={selectedStudentFee}
        onClose={() => setSelectedStudentFee(null)}
      />

      <StudentFeeEditModal
        studentFee={editingStudentFee}
        isLoading={updateStudentFeeMutation.isPending}
        onClose={() => setEditingStudentFee(null)}
        onSubmit={(data) => {
          updateStudentFeeMutation.mutate(
            {
              studentFeeId: editingStudentFee._id,
              updateData: data,
            },
            {
              onSuccess: () => {
                setEditingStudentFee(null);
              },
            },
          );
        }}
      />

      <StudentFeeCancelModal
        studentFee={cancellingStudentFee}
        isLoading={cancelStudentFeeMutation.isPending}
        onClose={() => setCancellingStudentFee(null)}
        onConfirm={() => {
          cancelStudentFeeMutation.mutate(cancellingStudentFee._id, {
            onSuccess: () => {
              setCancellingStudentFee(null);
            },
          });
        }}
      />
    </div>
  );
};

export default StudentFeePage;
