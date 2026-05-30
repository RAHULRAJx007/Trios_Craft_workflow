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

useEffect(() => {
loadProjects();
}, []);

async function loadProjects() {
const { data, error } = await supabase
.from("projects")
.select("*")
.order("created_at", { ascending: false });

if (error) {
  console.error(error);
  return;
}

setProjects(data || []);


}

async function createProject() {
if (!name.trim()) {
alert("Project name is required");
return;
}


const { error } = await supabase
  .from("projects")
  .insert([
    {
      name,
      description,
      budget: Number(budget) || 0,
      progress: 0,
      status: "active",
    },
  ]);

if (error) {
  alert(error.message);
  return;
}

alert("Project created successfully 🚀");

setName("");
setDescription("");
setBudget("");

loadProjects();


}

return ( <main className="text-white"> <h1 className="text-4xl font-bold">
Projects </h1>

  <div className="mt-8 bg-slate-900 p-6 rounded-xl max-w-xl">
    <h2 className="text-2xl font-semibold mb-4">
      Create Project
    </h2>

    <div className="space-y-4">
      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Project Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Budget"
        type="number"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value)
        }
      />

      <button
        onClick={createProject}
        className="bg-green-600 px-6 py-3 rounded-lg"
      >
        Create Project
      </button>
    </div>
  </div>

  <div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4">
      Project List
    </h2>

    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="bg-slate-900 p-4 rounded-lg">
          No projects found.
        </div>
      ) : (
        projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
          >
            <div className="bg-slate-900 p-5 rounded-xl hover:bg-slate-800 transition cursor-pointer">
              <h3 className="text-xl font-bold">
                {project.name}
              </h3>

              <p className="text-slate-400 mt-2">
                {project.description}
              </p>

              <div className="mt-3 flex gap-6">
                <span>
                  Budget: ₹{project.budget}
                </span>

                <span>
                  Progress: {project.progress}%
                </span>

                <span>
                  Status: {project.status}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
</main>
  );
}