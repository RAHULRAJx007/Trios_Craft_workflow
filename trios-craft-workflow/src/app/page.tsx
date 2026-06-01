import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: timeEntries } = await supabase.from("time_entries").select("*");

  const totalProjects = projects?.length || 0;
  const totalHours =
    timeEntries?.reduce((sum, e) => sum + Number(e.total_hours || 0), 0) || 0;
  const estimatedEarnings = totalHours * 500;

  const stats = [
    {
      label: "Total Hours",
      value: `${totalHours.toFixed(1)}h`,
      icon: "⏱",
      color: "var(--accent)",
      bg: "var(--accent-dim)",
      delay: "0ms",
    },
    {
      label: "Active Projects",
      value: totalProjects,
      icon: "📁",
      color: "var(--green)",
      bg: "var(--green-dim)",
      delay: "60ms",
    },
    {
      label: "Est. Earnings",
      value: `₹${estimatedEarnings.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "var(--amber)",
      bg: "var(--amber-dim)",
      delay: "120ms",
    },
    {
      label: "Sessions",
      value: timeEntries?.length || 0,
      icon: "🎯",
      color: "var(--purple)",
      bg: "var(--purple-dim)",
      delay: "180ms",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1000px",
        animation: "fadeUp 0.5s ease both",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div className="section-label" style={{ marginBottom: "8px" }}>
          Overview
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            lineHeight: 1.1,
          }}
        >
          Good morning 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px", fontSize: "15px" }}>
          Here&apos;s what&apos;s happening with your agency today.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              padding: "20px",
              animation: `fadeUp 0.5s ease both`,
              animationDelay: s.delay,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
                marginBottom: "14px",
              }}
            >
              {s.icon}
            </div>
            <div className="stat-value" style={{ color: s.color, fontSize: "24px" }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-tertiary)",
                marginTop: "4px",
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Projects list */}
      <div>
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
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Projects
          </h2>
          <Link
            href="/projects"
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View all →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(projects || []).length === 0 ? (
            <div
              className="card"
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--text-tertiary)",
              }}
            >
              No projects yet. Create one to get started.
            </div>
          ) : (
            (projects || []).slice(0, 5).map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="card card-interactive"
                style={{
                  padding: "18px 20px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  animation: `fadeUp 0.5s ease both`,
                  animationDelay: `${i * 60 + 240}ms`,
                }}
              >
                {/* Color dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background:
                      project.status === "completed"
                        ? "var(--green)"
                        : project.status === "active"
                        ? "var(--accent)"
                        : "var(--amber)",
                    flexShrink: 0,
                    boxShadow:
                      project.status === "active"
                        ? "0 0 0 3px var(--accent-dim)"
                        : "none",
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "-0.01em",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-tertiary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.description || "No description"}
                  </div>
                </div>

                {/* Progress */}
                <div style={{ width: "100px", flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                      Progress
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-tertiary)",
                    flexShrink: 0,
                  }}
                >
                  ₹{Number(project.budget).toLocaleString("en-IN")}
                </div>

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
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}