export default function BasicSkeleton() {
  return (
    <div
      className="h-80 p-4 mb-4 animate-pulse rounded-lg bg-[#000d] backdrop-blur-sm ring-4 ring-yellow-700"
    >
      <div className="animate-pulse">
        <div className="bg-yellow-400 h-6 w-full mb-2"></div>
        <div className="bg-yellow-300 h-4 w-3/4 mb-2"></div>
        <div className="bg-yellow-200 h-4 w-1/2"></div>
      </div>
    </div>
  );
}
