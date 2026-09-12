export default function BasicSkeleton() {
  return (
    <div
      className="h-80 bg-gray-100 border border-gray-300 rounded-lg shadow-sm p-4 mb-4 animate-pulse"
    >
      <div className="animate-pulse">
        <div className="bg-gray-400 h-6 w-full mb-2"></div>
        <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-4 w-1/2"></div>
      </div>
    </div>
  );
}
