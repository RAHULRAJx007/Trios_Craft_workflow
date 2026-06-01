import "./globals.css";
import AppShell from "@/components/AppShell";

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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}