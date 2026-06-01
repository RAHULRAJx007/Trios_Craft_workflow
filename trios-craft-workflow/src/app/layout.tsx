import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "TriosFlow — Workflow OS",
  description: "Agency Workflow Management",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          background: "var(--bg-base)",
          minHeight: "100vh",
        }}
      >
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
      </body>
    </html>
  );
}