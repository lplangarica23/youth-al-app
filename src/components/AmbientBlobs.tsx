// Pure CSS animation, so this can be a Server Component — no "use client"
// needed, no JS shipped to the browser for this piece.
export default function AmbientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}
