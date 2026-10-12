export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[8px] border border-[#8F8F8F]/30 overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-[#E5E5E5]" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-3/4 bg-[#E5E5E5] rounded" />
        <div className="h-3 w-1/2 bg-[#E5E5E5] rounded" />
        <div className="h-5 w-16 bg-[#E5E5E5] rounded" />
      </div>
    </div>
  );
}