import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-6xl font-extrabold text-acid">404</p>
      <h1 className="mb-3 text-2xl font-extrabold">Kjo faqe nuk u gjet</h1>
      <p className="mb-8 text-inksoft">
        Ndoshta lidhja ka ndryshuar, ose faqja nuk ekziston më.
      </p>
      <Link href="/" className="btn-primary">
        Kthehu në fillim
      </Link>
    </main>
  );
}
