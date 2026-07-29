export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-line/60 mb-6 h-8 w-40 rounded" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-line bg-surface h-28 rounded-xl border" />
        ))}
      </div>
    </div>
  );
}
