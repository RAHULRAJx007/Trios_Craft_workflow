import { supabase } from "@/lib/supabase";
import AddTaskForm from "./AddTaskForm";
import UpdateTaskProgress from "./UpdateTaskProgress";
import TaskAssignee from "./TaskAssignee";

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
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  if (!project) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-display)",
          fontSize: "18px",
        }}
      >
        Project not found
      </div>
    );
  }

  const completedTasks = tasks?.filter((t) => t.status === "completed").length || 0;
  const totalTasks = tasks?.length || 0;

  return (
    <div style={{ maxWidth: "800px", animation: "fadeUp 0.5s ease both" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          fontSize: "13px",
          color: "var(--text-tertiary)",
        }}
      >
        <a
          href="/projects"
          style={{
            color: "var(--text-tertiary)",
            textDecoration: "none",
            transition: "color var(--transition-fast)",
          }}
        >
          Projects
        </a>
        <span>›</span>
        <span style={{ color: "var(--text-secondary)" }}>{project.name}</span>
      </div>

      {/* Project header */}
      <div
        className="card"
        style={{
          padding: "28px",
          marginBottom: "24px",
          animation: "fadeUp 0.45s 60ms ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                {project.name}
              </h1>
              <span
                className={`badge ${
                  project.status === "completed"
                    ? "badge-green"
                    : project.status === "active"
                    ? "badge-blue"
                    : "badge-amber"
                }`}
              >
                {project.status}
              </span>
            </div>

            {project.description && (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            { label: "Budget", value: `₹${Number(project.budget).toLocaleString("en-IN")}`, color: "var(--amber)" },
            { label: "Progress", value: `${project.progress}%`, color: "var(--accent)" },
            { label: "Tasks", value: totalTasks, color: "var(--purple)" },
            { label: "Done", value: completedTasks, color: "var(--green)" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "12px",
              color: "var(--text-tertiary)",
            }}
          >
            <span>Overall progress</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{project.progress}%</span>
          </div>
          <div
            style={{
              height: "6px",
              background: "var(--bg-elevated)",
              borderRadius: "99px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${project.progress}%`,
                background: `linear-gradient(90deg, var(--accent), var(--purple))`,
                borderRadius: "99px",
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <div style={{ animation: "fadeUp 0.45s 120ms ease both" }}>
        <AddTaskForm projectId={id} />
      </div>

      {/* Tasks */}
      <div style={{ marginTop: "24px", animation: "fadeUp 0.45s 180ms ease both" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Tasks
          </h2>
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            {completedTasks}/{totalTasks} completed
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {!tasks || tasks.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: "14px",
              }}
            >
              No tasks yet. Add one above to get started.
            </div>
          ) : (
            tasks.map((task, i) => (
              <div
                key={task.id}
                className="card"
                style={{
                  padding: "18px 20px",
                  animation: `fadeUp 0.4s ease both`,
                  animationDelay: `${i * 50 + 200}ms`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  {/* Completion dot */}
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        task.status === "completed"
                          ? "var(--green)"
                          : task.progress > 0
                          ? "var(--accent)"
                          : "var(--bg-elevated)",
                      border:
                        task.status === "completed" || task.progress > 0
                          ? "none"
                          : "2px solid var(--border-hover)",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        textDecoration:
                          task.status === "completed" ? "line-through" : "none",
                        color:
                          task.status === "completed"
                            ? "var(--text-tertiary)"
                            : "var(--text-primary)",
                      }}
                    >
                      {task.title}
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      task.status === "completed"
                        ? "badge-green"
                        : task.status === "active"
                        ? "badge-blue"
                        : "badge-amber"
                    }`}
                  >
                    {task.status}
                  </span>

                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--accent)",
                      minWidth: "36px",
                      textAlign: "right",
                    }}
                  >
                    {task.progress}%
                  </span>
                </div>

                {/* Mini progress */}
                <div style={{ marginBottom: "12px" }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${task.progress}%`,
                        background:
                          task.status === "completed"
                            ? "var(--green)"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <TaskAssignee taskId={task.id} />

                      <UpdateTaskProgress
                        taskId={task.id}
                        projectId={id}
                      />
                    </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}