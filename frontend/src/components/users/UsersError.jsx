import { AlertCircle, RefreshCw } from "lucide-react";

const UsersError = ({ onRetry }) => {
  return (
    <div className="flex min-h-full items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Unable to load users
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while loading the users. Please try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default UsersError;
