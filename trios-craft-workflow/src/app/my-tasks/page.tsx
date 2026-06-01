"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_to", user.id);

    setTasks(data || []);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        My Tasks
      </h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-900 p-4 rounded"
          >
            <h3>{task.title}</h3>

            <p>Status: {task.status}</p>

            <p>Progress: {task.progress}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}