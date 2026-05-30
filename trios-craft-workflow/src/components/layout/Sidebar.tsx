import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-8">
        TriosFlow 🚀
      </h1>

      <nav className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-slate-300 hover:text-white"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/projects"
          className="text-slate-300 hover:text-white"
        >
          📁 Projects
        </Link>

        <Link
          href="/timer"
          className="text-slate-300 hover:text-white"
        >
          ⏱ Timer
        </Link>

        <Link
          href="/team"
          className="text-slate-300 hover:text-white"
        >
          👥 Team
        </Link>
      </nav>
    </aside>
  );
}