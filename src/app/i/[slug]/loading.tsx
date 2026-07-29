export default function InvitationLoading() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-2xl animate-pulse flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="bg-line/60 h-3 w-32 rounded" />
      <div className="bg-line/60 h-10 w-64 rounded" />
      <div className="bg-line/60 h-3 w-48 rounded" />
    </div>
  );
}
