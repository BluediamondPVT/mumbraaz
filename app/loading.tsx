export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="loading-spinner"></div>
      <p className="text-gray-500 font-medium">Loading...</p>
    </div>
  );
}

