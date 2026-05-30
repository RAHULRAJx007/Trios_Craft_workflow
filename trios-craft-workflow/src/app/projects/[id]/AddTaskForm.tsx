"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddTaskForm({
  projectId,
}: {
  projectId: string;
}) {
  const [title, setTitle] = useState("");

  async function addTask() {
    if (!title.trim()) {
      alert("Enter task title");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          project_id: projectId,
          title,
          status: "todo",
          progress: 0,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");

    alert("Task Added ✅");

    window.location.reload();
  }

  return (
    <div className="mt-8 bg-slate-900 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        Add Task
      </h2>

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Task Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <button
        onClick={addTask}
        className="mt-4 px-6 py-3 bg-blue-600 rounded"
      >
        Add Task
      </button>
    </div>
  );
}