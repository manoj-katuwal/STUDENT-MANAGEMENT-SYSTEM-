import React from "react";

const DashboardError = ({ onRetry }) => {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while fetching dashboard data.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default DashboardError;
