"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user && !isPublic) {
        router.replace("/login");
        return;
      }

      if (user && isPublic) {
        router.replace("/");
        return;
      }

      setChecking(false);
    }

    check();

    return () => {
      active = false;
    };
  }, [pathname, isPublic, router]);

  // Auth pages render full-screen without the app chrome.
  if (isPublic) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary)",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "36px 40px",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
