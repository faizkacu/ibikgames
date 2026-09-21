'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 px-4">
        <h2 className="text-xl font-bold text-red-600">
          Terjadi Kesalahan
        </h2>
        <pre className="text-left text-sm bg-gray-100 text-gray-800 p-4 rounded-lg max-w-xl mx-auto overflow-auto">
          {error.message}
          {error.digest && `\ndigest: ${error.digest}`}
        </pre>
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
