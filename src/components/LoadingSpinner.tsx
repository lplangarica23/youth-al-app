export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-acid" />
        <p className="text-sm text-inkdim">Duke ngarkuar...</p>
      </div>
    </div>
  );
}
