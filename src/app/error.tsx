"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-5xl">😕</p>
      <h1 className="mb-3 text-2xl font-extrabold">Diçka shkoi keq</h1>
      <p className="mb-8 text-inksoft">
        Na vjen keq — provo edhe një herë. Nëse vazhdon, na trego çfarë po
        bëje kur ndodhi.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          Provo përsëri
        </button>
        <a href="/" className="btn-ghost">
          Kthehu në fillim
        </a>
      </div>
    </main>
  );
}
