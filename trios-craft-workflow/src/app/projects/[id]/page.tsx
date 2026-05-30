import { supabase } from "@/lib/supabase";
import AddTaskForm from "./AddTaskForm";
import UpdateTaskProgress from "./UpdateTaskProgress";
export default async function ProjectDetails({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;
const { data: project } = await supabase
.from("projects")
.select("*")
.eq("id", id)
.single();
const { data: tasks } = await supabase
.from("tasks")
.select("*")
.eq("project_id", id);
if (!project) {
return Project not found;
}
return (


{project.name}

  <p className="mt-2 text-slate-400">
    {project.description}
  </p>

  <div className="mt-4 flex gap-6">
    <p>Budget: ₹{project.budget}</p>
    <p>Progress: {project.progress}%</p>
    <p>Status: {project.status}</p>
  </div>

  <AddTaskForm projectId={id} />

  <div className="mt-10">
    <h2 className="text-2xl font-bold">
      Tasks
    </h2>

    <div className="space-y-4 mt-4">
      {tasks?.map((task) => (
        <div
          key={task.id}
          className="bg-slate-900 p-4 rounded-lg"
        >
          <h3 className="font-bold">
            {task.title}
          </h3>

          <p>Status: {task.status}</p>

          <p>
            Progress: {task.progress}%
          </p>

          <UpdateTaskProgress
            taskId={task.id}
            projectId={id}
          />
        </div>
      ))}
    </div>
  </div>
</div>

);
}
