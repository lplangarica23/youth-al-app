import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-white/10 px-6 py-8 text-center text-sm text-inkdim">
      <p className="mb-2">
        © {new Date().getFullYear()} youth.al — Bërë për të rinjtë shqiptarë.
      </p>
      <div className="flex justify-center gap-5">
        <Link href="/privacy" className="underline hover:text-inksoft">
          Privatësia
        </Link>
        <Link href="/terms" className="underline hover:text-inksoft">
          Kushtet
        </Link>
      </div>
    </footer>
  );
}
