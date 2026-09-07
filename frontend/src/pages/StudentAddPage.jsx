import { useNavigate } from "react-router-dom";

const StudentAddPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Students
        </button>

        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Add Student
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new student profile and enrollment record.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Student form will go here.</p>
      </div>
    </div>
  );
};

export default StudentAddPage;
