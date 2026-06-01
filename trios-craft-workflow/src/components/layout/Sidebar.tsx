import Link from "next/link";
import LogoutButton from "../LogoutButton";

export default function Sidebar() {
  return (
    <aside
      className="sidebar"
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        padding: "28px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "sticky",
        top: 0,
        height: "100vh",
        animation: "slideInLeft 0.4s ease both",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "4px 12px 24px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              flexShrink: 0,
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🚀
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "17px",
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              TriosFlow
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
              }}
            >
              Workflow OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {[
          {
            href: "/",
            icon: "📊",
            label: "Dashboard",
          },
          {
            href: "/projects",
            icon: "📁",
            label: "Projects",
          },
          {
            href: "/timer",
            icon: "⏱",
            label: "Timer",
          },
          {
            href: "/earnings",
            icon: "💰",
            label: "Earnings",
          },
          {
            href: "/team",
            icon: "👥",
            label: "Team",
          },
          {
  href: "/my-tasks",
  icon: "✅",
  label: "My Tasks",
},
        ].map(({ href, icon, label }, i) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "var(--radius-md)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 450,
              transition: "all var(--transition-fast)",
              animation: `fadeUp 0.4s ease both`,
              animationDelay: `${60 + i * 50}ms`,
            }}
            className="nav-link"
          >
            <span
              style={{
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              {icon}
            </span>

            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* User Card */}
        <div
          style={{
            padding: "10px 12px",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeUp 0.4s 0.35s ease both",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--accent-dim)",
              border: "1px solid var(--border-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            R
          </div>

          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              Rahul
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
              }}
            >
              Owner
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </div>

      <style>{`
        .nav-link:hover {
          background: var(--bg-card);
          color: var(--text-primary);
          border-radius: var(--radius-md);
        }
      `}</style>
    </aside>
  );
}