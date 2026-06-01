import { supabase } from "@/lib/supabase";

export default async function EarningsPage() {
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: entries } = await supabase.from("time_entries").select("*");

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-8">
        Earnings Dashboard 💰
      </h1>

      {projects?.map((project) => {
        const projectEntries =
          entries?.filter(
            (entry) =>
              entry.project_id === project.id
          ) || [];

        const totalHours =
          projectEntries.reduce(
            (sum, entry) =>
              sum + Number(entry.total_hours || 0),
            0
          );

        return (
          <div
            key={project.id}
            className="bg-slate-900 p-6 rounded-xl mb-8"
          >
            <h2 className="text-2xl font-bold">
              {project.name}
            </h2>

            <p className="text-slate-400">
              Budget ₹{project.budget}
            </p>

            <div className="mt-6 space-y-4">
              {profiles?.map((profile) => {
                const memberHours =
                  projectEntries
                    .filter(
                      (entry) =>
                        entry.member_id ===
                        profile.id
                    )
                    .reduce(
                      (sum, entry) =>
                        sum +
                        Number(
                          entry.total_hours || 0
                        ),
                      0
                    );

                const share =
                  totalHours > 0
                    ? (
                        (memberHours /
                          totalHours) *
                        project.budget
                      ).toFixed(0)
                    : 0;

                return (
                  <div
                    key={profile.id}
                    className="border border-slate-700 rounded-lg p-4"
                  >
                    <h3 className="font-bold text-lg">
                      {profile.name}
                    </h3>

                    <p>
                      Hours Worked:{" "}
                      {memberHours.toFixed(2)}
                    </p>

                    <p>
                      Revenue Share: ₹{share}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-green-400">
              Total Hours:{" "}
              {totalHours.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}