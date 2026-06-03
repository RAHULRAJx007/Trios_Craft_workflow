"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Candidate = {
  id: string;
  name: string;
  email: string | null;
};

type Props = {
  query: string;
  onSelect: (user: Candidate) => void;
  conversationType: "team" | "client";
};

export default function MentionAutocomplete({
  query,
  onSelect,
}: Props) {
  const [loading, setLoading] = useState(false);

  const candidates = useMemo(() => [], []);

  // This component currently keeps dropdown logic minimal.
  // Full wiring will be implemented once MessageInput is created.
  // It still provides the search endpoint hook via onQuery.

  async function onQuery(q: string) {
    if (!q.trim()) return [] as Candidate[];
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,name,email")
        .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
        .limit(8);

      if (error) return [];

      return (data || []).map((r: { id: string; name?: string | null; email?: string | null }) => ({
        id: r.id as string,
        name: (r.name as string) || r.id,
        email: (r.email as string) ?? null,
      }));
    } finally {
      setLoading(false);
    }
  }

  // Placeholder UI (no dropdown rendering yet)
  // Phase 3: foundation only. Wiring comes in MessageInput.
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      {loading ? "Loading" : ""}
      {query}
      {candidates.length}
    </div>
  );
}

