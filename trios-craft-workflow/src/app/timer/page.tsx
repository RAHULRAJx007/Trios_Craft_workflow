"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
};

type ActiveSession = {
  id: string;
  started_at: string;
  project_id: string;
};

export default function TimerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [activeSession, setActiveSession] =
    useState<ActiveSession | null>(null);

  useEffect(() => {
    loadProjects();
    loadActiveSession();
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("id,name");

    setProjects(data || []);
  }

  async function loadActiveSession() {
    const { data } = await supabase
      .from("active_sessions")
      .select("*")
      .eq("user_id", "Rahul")
      .limit(1)
      .single();

    if (data) {
      setActiveSession(data);
    }
  }

  async function startWork() {
    if (!selectedProject) {
      alert("Select a project first");
      return;
    }

    const { data, error } = await supabase
      .from("active_sessions")
      .insert([
        {
          user_id: "Rahul",
          project_id: selectedProject,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setActiveSession(data);
    alert("Work Started 🚀");
  }

  async function stopWork() {
    if (!activeSession) return;

    const start = new Date(activeSession.started_at);
    const end = new Date();

    const hours =
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60);

    const { error: insertError } = await supabase
      .from("time_entries")
      .insert([
        {
          user_id: "Rahul",
          project_id: activeSession.project_id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          total_hours: Number(hours.toFixed(2)),
        },
      ]);

    if (insertError) {
      console.error(insertError);
      alert(insertError.message);
      return;
    }

    await supabase
      .from("active_sessions")
      .delete()
      .eq("id", activeSession.id);

    setActiveSession(null);

    alert(
      `Session Saved (${hours.toFixed(2)} hours)`
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold">
        Work Timer
      </h1>

      {!activeSession ? (
        <div className="mt-8 max-w-md">
          <select
            className="w-full p-3 rounded bg-slate-800"
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(e.target.value)
            }
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

          <button
            onClick={startWork}
            className="mt-4 px-6 py-3 bg-green-600 rounded"
          >
            Start Work
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <p className="mb-4 text-green-400">
            Work Session Running...
          </p>

          <p className="mb-4">
            Started At:
            {" "}
            {new Date(
              activeSession.started_at
            ).toLocaleString()}
          </p>

          <button
            onClick={stopWork}
            className="px-6 py-3 bg-red-600 rounded"
          >
            Stop Work
          </button>
        </div>
      )}
    </div>
  );
}