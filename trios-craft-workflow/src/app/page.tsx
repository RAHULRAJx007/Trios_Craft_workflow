import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*");

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*");

  const totalProjects = projects?.length || 0;

  const totalHours =
    timeEntries?.reduce(
      (sum, entry) =>
        sum + Number(entry.total_hours || 0),
      0
    ) || 0;

  const estimatedEarnings = totalHours * 500;

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold">
        TriosFlow 🚀
      </h1>

      <p className="text-slate-400 mt-2">
        Agency Workflow Management System
      </p>

      <div className="grid grid-cols-4 gap-6 mt-10">
        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">
            Total Hours
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {totalHours.toFixed(2)}h
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">
            Active Projects
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {totalProjects}
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">
            Estimated Earnings
          </p>
          <h2 className="text-4xl font-bold mt-2">
            ₹{estimatedEarnings}
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">
            Sessions
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {timeEntries?.length || 0}
          </h2>
        </div>
      </div>

      <div className="mt-10 bg-slate-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Projects
        </h2>

        {projects?.map((project) => (
          <div
            key={project.id}
            className="border border-slate-700 rounded-lg p-4 mb-3"
          >
            <h3 className="font-bold text-xl">
              {project.name}
            </h3>

            <p className="text-slate-400">
              {project.description}
            </p>

            <p className="mt-2">
              Budget: ₹{project.budget}
            </p>

            <p>
              Progress: {project.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}