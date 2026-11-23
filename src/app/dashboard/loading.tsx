import SkeletonCard from '../../components/SkeletonCard';

export default function Loading() {
  return (
    <div className="p-6 space-y-4 bg-[#B3EAE8] min-h-screen">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}