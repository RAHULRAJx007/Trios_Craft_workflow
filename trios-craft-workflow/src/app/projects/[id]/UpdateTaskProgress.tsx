"use client";
import { supabase } from "@/lib/supabase";
export default function UpdateTaskProgress({
taskId,
projectId,
}: {
taskId: string;
projectId: string;
}) {
async function updateProgress(
progress: number
) {
await supabase
.from("tasks")
.update({
progress,
status:
progress === 100
? "completed"
: "active",
})
.eq("id", taskId);
const { data: tasks } =
  await supabase
    .from("tasks")
    .select("progress")
    .eq("project_id", projectId);

const avg =
  tasks?.reduce(
    (sum, task) =>
      sum + task.progress,
    0
  ) || 0;

const projectProgress =
  tasks?.length
    ? Math.round(avg / tasks.length)
    : 0;

await supabase
  .from("projects")
  .update({
    progress: projectProgress,
  })
  .eq("id", projectId);

window.location.reload();

}
return (

{[0, 25, 50, 75, 100].map(
(value) => (
<button
key={value}
onClick={() =>
updateProgress(value)
}
className="px-3 py-1 bg-blue-600 rounded"
>
{value}%

)
)}

);
}
