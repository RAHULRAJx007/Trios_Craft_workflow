"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string;
};

export default function TaskAssignee({
  taskId,
}: {
  taskId: string;
}) {
  const [profiles, setProfiles] = useState<
    Profile[]
  >([]);

  const [selectedUser, setSelectedUser] =
    useState("");

  useEffect(() => {
    loadProfiles();
    loadTaskAssignee();
  }, []);

  async function loadProfiles() {
    const { data } = await supabase
      .from("profiles")
      .select("id,name");

    setProfiles(data || []);
  }

  async function loadTaskAssignee() {
    const { data } = await supabase
      .from("tasks")
      .select("assigned_to")
      .eq("id", taskId)
      .single();

    if (data?.assigned_to) {
      setSelectedUser(data.assigned_to);
    }
  }

  async function assignUser(userId: string) {
    setSelectedUser(userId);

    const { error } = await supabase
      .from("tasks")
      .update({
        assigned_to: userId,
      })
      .eq("id", taskId);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          marginBottom: "6px",
          color: "var(--text-tertiary)",
        }}
      >
        Assigned To
      </label>

      <select
        value={selectedUser}
        onChange={(e) =>
          assignUser(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          background: "var(--bg-elevated)",
          color: "white",
          border: "1px solid var(--border)",
        }}
      >
        <option value="">
          Select Member
        </option>

        {profiles.map((profile) => (
          <option
            key={profile.id}
            value={profile.id}
          >
            {profile.name}
          </option>
        ))}
      </select>
    </div>
  );
}