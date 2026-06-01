"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
  description: string;
  budget: number;
  progress: number;
  status: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setFetching(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
    setFetching(false);
  }

  async function createProject() {
    if (!name.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("projects").insert([
      {
        name,
        description,
        budget: Number(budget) || 0,
        progress: 0,
        status: "active",
      },
    ]);

    setLoading(false);

    if (!error) {
      setName("");
      setDescription("");
      setBudget("");
      setShowForm(false);
      loadProjects();
    }
  }

  return (
    <>
      <style>{`
        .project-row:hover .project-arrow { opacity: 1; transform: translateX(0); }
        .project-arrow { opacity: 0; transform: translateX(-4px); transition: all 0.2s ease; }
        .form-overlay { animation: fadeIn 0.2s ease both; }
        .form-panel { animation: scaleIn 0.25s ease both; }
      `}</style>

      <div style={{ maxWidth: "860px", animation: "fadeUp 0.5s ease both" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: "8px" }}>
              Management
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Projects
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "14px" }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: "7px" }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            New Project
          </button>
        </div>

        {/* Create form modal */}
        {showForm && (
          <div
            className="form-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <div
              className="card form-panel"
              style={{ width: "100%", maxWidth: "460px", padding: "28px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "18px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Create Project
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                    fontSize: "20px",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    transition: "color var(--transition-fast)",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-tertiary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Project Name *
                  </label>
                  <input
                    className="input"
                    placeholder="My awesome project"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-tertiary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Description
                  </label>
                  <input
                    className="input"
                    placeholder="What's this project about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-tertiary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Budget (₹)
                  </label>
                  <input
                    className="input"
                    placeholder="50000"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    className="btn"
                    onClick={() => setShowForm(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={createProject}
                    disabled={loading || !name.trim()}
                    style={{
                      flex: 2,
                      opacity: !name.trim() ? 0.5 : 1,
                    }}
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {fetching ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  height: "80px",
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))
          ) : projects.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "60px 40px",
                textAlign: "center",
                animation: "scaleIn 0.3s ease both",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>📁</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                No projects yet
              </div>
              <p style={{ color: "var(--text-tertiary)", fontSize: "14px" }}>
                Create your first project to get started.
              </p>
            </div>
          ) : (
            projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="card card-interactive project-row"
                style={{
                  padding: "18px 20px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  animation: `fadeUp 0.45s ease both`,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                {/* Status dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      project.status === "completed"
                        ? "var(--green)"
                        : project.status === "active"
                        ? "var(--accent)"
                        : "var(--amber)",
                    boxShadow:
                      project.status === "active"
                        ? "0 0 0 3px var(--accent-dim)"
                        : "none",
                  }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "-0.01em",
                      marginBottom: "3px",
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

                {/* Progress bar */}
                <div style={{ width: "120px", flexShrink: 0 }}>
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

                {/* Budget */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    flexShrink: 0,
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  ₹{Number(project.budget).toLocaleString("en-IN")}
                </div>

                {/* Status badge */}
                <span
                  className={`badge ${
                    project.status === "completed"
                      ? "badge-green"
                      : project.status === "active"
                      ? "badge-blue"
                      : "badge-amber"
                  }`}
                  style={{ flexShrink: 0 }}
                >
                  {project.status}
                </span>

                {/* Arrow */}
                <span
                  className="project-arrow"
                  style={{ fontSize: "16px", color: "var(--text-tertiary)" }}
                >
                  →
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}