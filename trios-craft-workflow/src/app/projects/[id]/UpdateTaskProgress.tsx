"use client";

import { supabase } from "@/lib/supabase";

export default function UpdateTaskProgress({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) {
  async function updateProgress(progress: number) {
    const { error: taskError } = await supabase
      .from("tasks")
      .update({
        progress,
        status:
          progress === 100
            ? "completed"
            : progress > 0
            ? "active"
            : "todo",
      })
      .eq("id", taskId);

    if (taskError) {
      alert(taskError.message);
      return;
    }

    // Get all tasks for this project
    const { data: tasks, error: tasksError } =
      await supabase
        .from("tasks")
        .select("progress")
        .eq("project_id", projectId);

    if (tasksError || !tasks) {
      console.error(tasksError);
      return;
    }

    const totalProgress = tasks.reduce(
      (sum, task) => sum + Number(task.progress || 0),
      0
    );

    const projectProgress =
      tasks.length > 0
        ? Math.round(totalProgress / tasks.length)
        : 0;

    const projectStatus =
      projectProgress === 100
        ? "completed"
        : projectProgress > 0
        ? "active"
        : "todo";

    const { error: projectError } =
      await supabase
        .from("projects")
        .update({
          progress: projectProgress,
          status: projectStatus,
        })
        .eq("id", projectId);

    if (projectError) {
      console.error(projectError);
      alert(projectError.message);
      return;
    }

    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-tertiary)",
          marginRight: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}
      >
        Progress
      </span>

      {[0, 25, 50, 75, 100].map((value) => (
        <button
          key={value}
          onClick={() => updateProgress(value)}
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--bg-elevated)",
            color:
              value === 100
                ? "var(--green)"
                : value === 0
                ? "var(--text-tertiary)"
                : "var(--accent)",
            cursor: "pointer",
          }}
        >
          {value}%
        </button>
      ))}
    </div>
  );
}